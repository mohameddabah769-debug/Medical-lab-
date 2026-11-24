/**
 * نظام إدارة المختبرات الطبية - LabCore Pro
 * محرك إدارة الحالة المركزي والتخزين الفوري (State Management & Persistence Store)
 */

const STORAGE_KEY = "LABCORE_CLINICAL_DATABASE_V4";

class LabStore {
  constructor() {
    this.listeners = [];
    this.state = this.loadState();
  }

  /**
   * تحميل الحالة من التخزين المحلي أو التهيئة بالبيانات التأسيسية
   */
  loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.orders && parsed.tests) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("تعذر قراءة البيانات المحفوظة، سيتم استخدام البيانات التأسيسية:", e);
    }

    // التهيئة بنسخة نظيفة وعميقة من البيانات التأسيسية
    const initial = JSON.parse(JSON.stringify(window.SEED_DATA));
    initial.theme = localStorage.getItem("LABCORE_THEME") || "dark";
    initial.currentView = "dashboard";
    initial.activeOrderId = null;
    return initial;
  }

  /**
   * حفظ الحالة فورياً في localStorage وإشعار المشتركين
   */
  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error("فشل التخزين في localStorage:", e);
    }
    this.notify();
  }

  /**
   * الاشتراك في تحديثات الحالة
   */
  subscribe(listener) {
    if (typeof listener === "function") {
      this.listeners.push(listener);
    }
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn(this.state));
  }

  // ==========================================
  // إدارة الثيم والشاشات
  // ==========================================
  setTheme(theme) {
    this.state.theme = theme;
    localStorage.setItem("LABCORE_THEME", theme);
    document.documentElement.setAttribute("data-theme", theme);
    this.save();
  }

  setView(viewName, activeOrderId = null) {
    this.state.currentView = viewName;
    if (activeOrderId !== undefined && activeOrderId !== null) {
      this.state.activeOrderId = activeOrderId;
    }
    this.notify();
    if (window.app) {
      window.app.navigateTo(viewName);
    }
  }

  // ==========================================
  // إدارة المرضى (Patients)
  // ==========================================
  addPatient(patientData) {
    const id = LabBarcode.generatePatientId(this.state.patients);
    const newPatient = {
      id,
      name: patientData.name.trim(),
      age: parseInt(patientData.age) || 0,
      gender: patientData.gender || "male",
      phone: patientData.phone ? patientData.phone.trim() : "",
      doctor: patientData.doctor ? patientData.doctor.trim() : "طلب مريض مباشر",
      contractId: patientData.contractId || null,
      createdAt: new Date().toISOString()
    };
    this.state.patients.unshift(newPatient);
    this.save();
    return newPatient;
  }

  getPatient(id) {
    return this.state.patients.find(p => p.id === id);
  }

  findPatientByPhone(phone) {
    if (!phone) return null;
    const clean = phone.replace(/[^0-9]/g, '');
    if (clean.length < 8) return null;
    return this.state.patients.find(p => {
      const pClean = (p.phone || '').replace(/[^0-9]/g, '');
      return pClean === clean || (clean.length >= 9 && pClean.endsWith(clean.slice(-9)));
    });
  }

  updatePatient(id, patientData) {
    const patient = this.getPatient(id);
    if (!patient) return null;
    if (patientData.name) patient.name = patientData.name.trim();
    if (patientData.age) patient.age = parseInt(patientData.age) || patient.age;
    if (patientData.gender) patient.gender = patientData.gender;
    if (patientData.phone) patient.phone = patientData.phone.trim();
    if (patientData.doctor) patient.doctor = patientData.doctor.trim();
    if (patientData.contractId !== undefined) patient.contractId = patientData.contractId;
    this.save();
    return patient;
  }

  // ==========================================
  // إدارة طلبات التحاليل (Orders & Billing)
  // ==========================================
  createOrder({ patientId, testIds, discountAmount = 0, paidAmount = 0, paymentMethod = "cash" }) {
    const { orderId, barcode } = LabBarcode.generateOrderNumber(this.state.orders);
    
    // احتساب إجمالي تكلفة الفحوصات المختارة
    let totalAmount = 0;
    testIds.forEach(tId => {
      // فحص إذا كان تحليلاً منفرداً أو باقة
      const singleTest = this.state.tests.find(t => t.id === tId);
      if (singleTest) {
        totalAmount += Number(singleTest.price);
      } else {
        const pkg = this.state.packages.find(p => p.id === tId);
        if (pkg) {
          totalAmount += Number(pkg.price);
        }
      }
    });

    const netAmount = Math.max(0, totalAmount - Number(discountAmount));
    const paid = Math.min(netAmount, Math.max(0, Number(paidAmount)));
    const remaining = Math.max(0, netAmount - paid);

    // تفكيك الباقات إلى تحاليل فعلية للتحليل المخبري
    const actualTestIds = [];
    testIds.forEach(tId => {
      const pkg = this.state.packages.find(p => p.id === tId);
      if (pkg) {
        pkg.testIds.forEach(subId => {
          if (!actualTestIds.includes(subId)) actualTestIds.push(subId);
        });
      } else {
        if (!actualTestIds.includes(tId)) actualTestIds.push(tId);
      }
    });

    const newOrder = {
      id: orderId,
      barcode,
      patientId,
      requestedItems: testIds, // التحاليل والباقات المطلوبة
      testsRequested: actualTestIds, // قائمة التحاليل الفعلية المفردة
      totalAmount,
      discountAmount: Number(discountAmount),
      netAmount,
      paidAmount: paid,
      remainingAmount: remaining,
      paymentMethod,
      status: "pending", // pending -> completed -> validated
      results: {},
      doctorNotes: "",
      validatedAt: null,
      validatedBy: null,
      createdAt: new Date().toISOString()
    };

    this.state.orders.unshift(newOrder);
    this.save();
    return newOrder;
  }

  getOrder(id) {
    return this.state.orders.find(o => o.id === id);
  }

  updateOrderResults(orderId, results, doctorNotes = "") {
    const order = this.getOrder(orderId);
    if (!order) return false;

    order.results = results;
    order.doctorNotes = doctorNotes;
    // إذا لم يكن معتمداً، نحدث حالته إلى completed (تم إدخال النتائج وفي انتظار الاعتماد)
    if (order.status !== "validated") {
      order.status = "completed";
    }
    this.save();
    return true;
  }

  validateOrder(orderId, validatorName = null) {
    const order = this.getOrder(orderId);
    if (!order) return false;

    const validator = validatorName || this.state.labProfile.directorName;
    order.status = "validated";
    order.validatedAt = new Date().toISOString();
    order.validatedBy = validator;
    this.save();
    return true;
  }

  unvalidateOrder(orderId) {
    const order = this.getOrder(orderId);
    if (!order) return false;

    order.status = "completed";
    order.validatedAt = null;
    order.validatedBy = null;
    this.save();
    return true;
  }

  payOrderRemaining(orderId, payAmount) {
    const order = this.getOrder(orderId);
    if (!order) return false;

    const amt = parseFloat(payAmount);
    if (isNaN(amt) || amt <= 0) return false;

    const actualPayment = Math.min(order.remainingAmount, amt);
    order.paidAmount += actualPayment;
    order.remainingAmount = Math.max(0, order.remainingAmount - actualPayment);
    this.save();
    return true;
  }

  // ==========================================
  // دليل التحاليل والباقات (Catalog)
  // ==========================================
  addTest(testData) {
    const newTest = {
      id: `test-${Date.now()}`,
      code: testData.code.trim().toUpperCase(),
      nameAr: testData.nameAr.trim(),
      nameEn: testData.nameEn.trim(),
      category: testData.category || "كيمياء الدم العامة",
      price: parseFloat(testData.price) || 0,
      parameters: testData.parameters || []
    };
    this.state.tests.push(newTest);
    this.save();
    return newTest;
  }

  updateTest(id, testData) {
    const idx = this.state.tests.findIndex(t => t.id === id);
    if (idx === -1) return false;
    this.state.tests[idx] = { ...this.state.tests[idx], ...testData };
    this.save();
    return true;
  }

  deleteTest(id) {
    this.state.tests = this.state.tests.filter(t => t.id !== id);
    this.save();
    return true;
  }

  addPackage(pkgData) {
    const newPkg = {
      id: `pkg-${Date.now()}`,
      nameAr: pkgData.nameAr.trim(),
      nameEn: pkgData.nameEn.trim(),
      description: pkgData.description || "",
      testIds: pkgData.testIds || [],
      price: parseFloat(pkgData.price) || 0,
      active: true
    };
    this.state.packages.push(newPkg);
    this.save();
    return newPkg;
  }

  // ==========================================
  // الخزينة والمصروفات والتعاقدات (Finance)
  // ==========================================
  addExpense(expenseData) {
    const newExpense = {
      id: `EXP-${Date.now()}`,
      title: expenseData.title.trim(),
      category: expenseData.category || "مستلزمات عامة",
      amount: parseFloat(expenseData.amount) || 0,
      date: expenseData.date || new Date().toISOString().split("T")[0],
      notes: expenseData.notes ? expenseData.notes.trim() : ""
    };
    this.state.expenses.unshift(newExpense);
    this.save();
    return newExpense;
  }

  deleteExpense(id) {
    this.state.expenses = this.state.expenses.filter(e => e.id !== id);
    this.save();
    return true;
  }

  addContract(contractData) {
    const newContract = {
      id: `cont-${Date.now()}`,
      name: contractData.name.trim(),
      discountPercent: parseFloat(contractData.discountPercent) || 0,
      patientSharePercent: parseFloat(contractData.patientSharePercent) || 0
    };
    this.state.contracts.push(newContract);
    this.save();
    return newContract;
  }

  // ==========================================
  // إعدادات المختبر والترويسة (Lab Settings)
  // ==========================================
  updateLabProfile(profileData) {
    this.state.labProfile = { ...this.state.labProfile, ...profileData };
    this.save();
    return this.state.labProfile;
  }

  // ==========================================
  // الحسابات والإحصائيات الحية (Dynamic KPIs)
  // ==========================================
  getKPIs() {
    const todayStr = new Date().toISOString().split("T")[0];

    const todayOrders = this.state.orders.filter(o => 
      o.createdAt && o.createdAt.startsWith(todayStr)
    );

    const pendingTests = this.state.orders.filter(o => o.status === "pending").length;
    const readyTests = this.state.orders.filter(o => o.status === "validated").length;

    // إجمالي المقبوضات المحصلة اليوم
    const todayRevenue = todayOrders.reduce((sum, o) => sum + (Number(o.paidAmount) || 0), 0);

    // إجمالي المديونيات المتبقية طرف كل المرضى
    const totalRemaining = this.state.orders.reduce((sum, o) => sum + (Number(o.remainingAmount) || 0), 0);

    // إجمالي المصروفات اليومية
    const todayExpenses = this.state.expenses
      .filter(e => e.date === todayStr)
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

    return {
      todayPatientsCount: todayOrders.length,
      pendingTests,
      readyTests,
      todayRevenue,
      totalRemaining,
      todayExpenses,
      netDailyIncome: todayRevenue - todayExpenses,
      allOrdersCount: this.state.orders.length
    };
  }

  // ==========================================
  // النسخ الاحتياطي (Export / Import / Reset)
  // ==========================================
  exportBackupJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.state, null, 2));
    const downloadAnchor = document.createElement("a");
    const dateStr = new Date().toISOString().slice(0, 10);
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `LabCore_Backup_${dateStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  importBackupJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || !parsed.tests || !parsed.orders) {
        throw new Error("ملف النسخة الاحتياطية غير متوافق");
      }
      this.state = parsed;
      this.save();
      return true;
    } catch (e) {
      console.error("فشل استيراد النسخة الاحتياطية:", e);
      return false;
    }
  }

  resetToSeedData() {
    this.state = JSON.parse(JSON.stringify(window.SEED_DATA));
    this.state.theme = localStorage.getItem("LABCORE_THEME") || "dark";
    this.state.currentView = "dashboard";
    this.state.activeOrderId = null;
    this.save();
  }
}

// تهيئة الكائن العام
window.store = new LabStore();
