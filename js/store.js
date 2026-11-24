/**
 * نظام إدارة المختبرات الطبية - LabCore Pro
 * محرك إدارة الحالة المركزي والتخزين الفوري (State Management & Persistence Store)
 */

const STORAGE_KEY = "LABCORE_CLINICAL_DATABASE_V7";

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
          parsed.developerInfo = window.SEED_DATA.developerInfo;
          // تحديث فوري لأي بيانات سابقة باسم شريف عبد الوهاب إلى أ.د أحمد المراغي
          if (parsed.labProfile && (parsed.labProfile.directorName?.includes("شريف") || parsed.labProfile.nameAr?.includes("رويال"))) {
            parsed.labProfile = window.SEED_DATA.labProfile;
          }
          if (parsed.staff) {
            parsed.staff.forEach(s => {
              if (s.name?.includes("شريف") || s.username === "dr_sherif") {
                s.name = "أ.د أحمد المراغي";
                s.username = "dr_ahmed";
                s.email = "serum.lab@gmail.com";
                s.phone = "01061615225";
              }
            });
          }
          if (parsed.orders) {
            parsed.orders.forEach(o => {
              if (o.validatedBy?.includes("شريف")) {
                o.validatedBy = "أ.د أحمد المراغي";
              }
            });
          }
          return parsed;
        }
      }

      // في حال الترقية من إصدار سابق، ننقل السجلات الحية مع اعتماد قائمة أسعار التحاليل الجديدة
      const oldKeys = ["LABCORE_CLINICAL_DATABASE_V6", "LABCORE_CLINICAL_DATABASE_V5", "LABCORE_CLINICAL_DATABASE_V4"];
      for (const oldKey of oldKeys) {
        const oldRaw = localStorage.getItem(oldKey);
        if (oldRaw) {
          const oldData = JSON.parse(oldRaw);
          const initial = JSON.parse(JSON.stringify(window.SEED_DATA));
          if (oldData.orders) initial.orders = oldData.orders;
          if (oldData.patients) initial.patients = oldData.patients;
          if (oldData.expenses) initial.expenses = oldData.expenses;
          if (oldData.staff) initial.staff = oldData.staff;
          if (oldData.labProfile) initial.labProfile = oldData.labProfile;
          initial.theme = localStorage.getItem("LABCORE_THEME") || "dark";
          initial.currentView = "dashboard";
          initial.activeOrderId = null;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
          return initial;
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

  payOrderRemaining(orderId, payAmount, paymentMethod = "cash", notes = "") {
    const order = this.getOrder(orderId);
    if (!order) return false;

    const amt = parseFloat(payAmount);
    if (isNaN(amt) || amt <= 0) return false;

    const actualPayment = Math.min(order.remainingAmount, amt);
    order.paidAmount += actualPayment;
    order.remainingAmount = Math.max(0, order.remainingAmount - actualPayment);

    // تسجيل إيصال السداد في سجل مدفوعات الزيارة
    if (!order.paymentHistory) order.paymentHistory = [];
    order.paymentHistory.push({
      id: `RCP-${Date.now()}`,
      amount: actualPayment,
      paymentMethod: paymentMethod || "cash",
      notes: notes || "تحصيل دفعة متبقية من الزيارة",
      date: new Date().toISOString(),
      by: (this.getCurrentUser() && this.getCurrentUser().name) || "مسؤول الخزينة"
    });

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

  updatePackage(id, pkgData) {
    const pkg = (this.state.packages || []).find(p => p.id === id);
    if (!pkg) return false;
    Object.assign(pkg, pkgData);
    this.save();
    return pkg;
  }

  deletePackage(id) {
    this.state.packages = (this.state.packages || []).filter(p => p.id !== id);
    this.save();
    return true;
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
    this.notify();
    return this.state.labProfile;
  }

  // ==========================================
  // فريق العمل والصلاحيات (Staff & RBAC)
  // ==========================================
  getCurrentUser() {
    const currentId = this.state.currentUserId || "STAFF-101";
    return (this.state.staff || []).find(s => s.id === currentId) || (this.state.staff && this.state.staff[0]) || {
      id: "STAFF-101",
      name: "أ.د أحمد المراغي",
      role: "director"
    };
  }

  getCurrentRole() {
    const user = this.getCurrentUser();
    if (!user) return null;
    return (this.state.roles || []).find(r => r.id === user.role) || {
      id: user.role,
      title: "مدير المختبر",
      permissions: ["dashboard", "reception", "catalog", "results", "validate_results", "medical-report", "finance", "settings", "staff"]
    };
  }

  hasPermission(permKey) {
    const user = this.getCurrentUser();
    // إذا كان للموظف مصفوفة صلاحيات مخصصة (Custom Granular RBAC)
    if (user && Array.isArray(user.customPermissions)) {
      return user.customPermissions.includes(permKey);
    }
    const role = this.getCurrentRole();
    if (!role || !role.permissions) return true;
    return role.permissions.includes(permKey);
  }

  getUserPermissions(userId) {
    const user = (this.state.staff || []).find(s => s.id === userId);
    if (!user) return [];
    if (Array.isArray(user.customPermissions)) {
      return [...user.customPermissions];
    }
    const role = (this.state.roles || []).find(r => r.id === user.role);
    return role && role.permissions ? [...role.permissions] : [];
  }

  updateStaffPermissions(staffId, permissionsArray) {
    const user = (this.state.staff || []).find(s => s.id === staffId);
    if (!user) return false;
    user.customPermissions = permissionsArray;
    this.save();
    return true;
  }

  switchUser(staffId) {
    const staff = (this.state.staff || []).find(s => s.id === staffId);
    if (!staff) return false;
    this.state.currentUserId = staffId;
    localStorage.setItem("LABCORE_SESSION_USER", staffId);
    this.save();
    return staff;
  }

  // ==========================================
  // المصادقة وجلسة الدخول (Authentication)
  // ==========================================
  authenticate(username, password) {
    const u = (username || "").trim().toLowerCase();
    const p = (password || "").trim();

    const staffList = this.state.staff || [];
    const user = staffList.find(s => 
      s.username.toLowerCase() === u || 
      (s.email && s.email.toLowerCase() === u) ||
      (s.phone && s.phone === u)
    );

    if (!user) {
      return { success: false, message: "اسم المستخدم غير مسجل بالنظام" };
    }

    if (user.password && user.password !== p) {
      return { success: false, message: "كلمة المرور غير صحيحة" };
    }

    if (user.status !== "active") {
      return { success: false, message: "هذا الحساب معطل حالياً، برجاء مراجعة مدير المختبر" };
    }

    this.state.currentUserId = user.id;
    localStorage.setItem("LABCORE_SESSION_USER", user.id);
    this.save();
    return { success: true, user };
  }

  logout() {
    localStorage.removeItem("LABCORE_SESSION_USER");
    this.notify();
  }

  isAuthenticated() {
    const sessionId = localStorage.getItem("LABCORE_SESSION_USER");
    if (!sessionId) return false;
    const user = (this.state.staff || []).find(s => s.id === sessionId);
    return user && user.status === "active";
  }

  addStaff(staffData) {
    if (!this.state.staff) this.state.staff = [];
    const nextNum = this.state.staff.length + 101;
    const newMember = {
      id: `STAFF-${nextNum}`,
      name: staffData.name.trim(),
      username: staffData.username.trim().toLowerCase(),
      password: staffData.password ? staffData.password.trim() : "123456",
      role: staffData.role || "technician",
      phone: staffData.phone ? staffData.phone.trim() : "",
      email: staffData.email ? staffData.email.trim() : "",
      status: "active",
      joinedDate: new Date().toISOString().split("T")[0]
    };
    this.state.staff.push(newMember);
    this.save();
    return newMember;
  }

  updateStaff(id, data) {
    const member = (this.state.staff || []).find(s => s.id === id);
    if (!member) return false;
    Object.assign(member, data);
    this.save();
    return member;
  }

  toggleStaffStatus(id) {
    const member = (this.state.staff || []).find(s => s.id === id);
    if (!member) return false;
    member.status = member.status === "active" ? "inactive" : "active";
    this.save();
    return member;
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
  // الفحص والتدقيق المالي الشامل (Dynamic Audit Ledger)
  // ==========================================
  getAuditTransactions(filters = {}) {
    const list = [];

    // 1. استخراج مقبوضات الزيارات الأولية والمدفوعات
    (this.state.orders || []).forEach(order => {
      const patient = this.getPatient(order.patientId) || { name: "مريض غير محدد" };
      
      const paymentsSum = (order.paymentHistory || []).reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
      const initialPaid = Math.max(0, (Number(order.paidAmount) || 0) - paymentsSum);

      if (initialPaid > 0) {
        list.push({
          id: `TX-ORD-${order.id}`,
          refId: order.id,
          barcode: order.barcode,
          type: "order_receipt",
          typeLabel: "سند قبض زيارة جديدة",
          direction: "in",
          amount: initialPaid,
          party: patient.name,
          details: `حجز فحوصات (${order.requestedItems ? order.requestedItems.length : 1} فحص) - كود عينة ${order.barcode}`,
          paymentMethod: order.paymentMethod || "cash",
          date: order.createdAt || new Date().toISOString(),
          audited: true,
          by: "موظف الاستقبال"
        });
      }

      // الدفعات اللاحقة المسددة لسندات المتبقي
      if (order.paymentHistory && Array.isArray(order.paymentHistory)) {
        order.paymentHistory.forEach(pmt => {
          list.push({
            id: `TX-PAY-${pmt.id}`,
            refId: order.id,
            barcode: order.barcode,
            type: "debt_collection",
            typeLabel: "تحصيل متبقي مديونية",
            direction: "in",
            amount: Number(pmt.amount) || 0,
            party: patient.name,
            details: `سداد دفعة من متبقي الزيارة ${order.barcode} - ${pmt.notes || ''}`,
            paymentMethod: pmt.paymentMethod || "cash",
            date: pmt.date || order.createdAt,
            audited: true,
            by: pmt.by || "مسؤول الخزينة"
          });
        });
      }
    });

    // 2. استخراج المصروفات التشغيلية
    (this.state.expenses || []).forEach(exp => {
      const expDate = exp.date && exp.date.includes("T") ? exp.date : `${exp.date || new Date().toISOString().split("T")[0]}T10:00:00.000Z`;
      list.push({
        id: `TX-EXP-${exp.id}`,
        refId: exp.id,
        barcode: exp.id,
        type: "expense",
        typeLabel: "سند صرف مصروفات",
        direction: "out",
        amount: Number(exp.amount) || 0,
        party: exp.category || "مصروفات معملية",
        details: `${exp.title} ${exp.notes ? ' - ' + exp.notes : ''}`,
        paymentMethod: "cash",
        date: expDate,
        audited: true,
        by: "مسؤول الخزينة"
      });
    });

    // الترتيب الزمني التنازلي (الأحدث أولاً)
    list.sort((a, b) => new Date(b.date) - new Date(a.date));

    // تطبيق الفلاتر الديناميكية
    let filtered = list;

    // فلتر التاريخ
    if (filters.dateRange && filters.dateRange !== "all") {
      const now = new Date();
      const todayStr = now.toISOString().split("T")[0];
      
      if (filters.dateRange === "today") {
        filtered = filtered.filter(item => item.date.startsWith(todayStr));
      } else if (filters.dateRange === "yesterday") {
        const y = new Date(now);
        y.setDate(y.getDate() - 1);
        const yStr = y.toISOString().split("T")[0];
        filtered = filtered.filter(item => item.date.startsWith(yStr));
      } else if (filters.dateRange === "week") {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(item => new Date(item.date) >= weekAgo);
      } else if (filters.dateRange === "month") {
        const monthPrefix = todayStr.slice(0, 7);
        filtered = filtered.filter(item => item.date.startsWith(monthPrefix));
      }
    }

    // فلتر نوع الحركة
    if (filters.type && filters.type !== "all") {
      filtered = filtered.filter(item => item.type === filters.type);
    }

    // فلتر وسيلة الدفع
    if (filters.method && filters.method !== "all") {
      filtered = filtered.filter(item => item.paymentMethod === filters.method);
    }

    // فلتر البحث النصي
    if (filters.search && filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      filtered = filtered.filter(item => 
        (item.party && item.party.toLowerCase().includes(q)) ||
        (item.details && item.details.toLowerCase().includes(q)) ||
        (item.barcode && item.barcode.toLowerCase().includes(q)) ||
        (item.id && item.id.toLowerCase().includes(q))
      );
    }

    // احتساب الإجماليات والمؤشرات
    const totalInflow = filtered.filter(t => t.direction === "in").reduce((sum, t) => sum + t.amount, 0);
    const totalOutflow = filtered.filter(t => t.direction === "out").reduce((sum, t) => sum + t.amount, 0);
    const netCash = totalInflow - totalOutflow;

    return {
      transactions: filtered,
      totalCount: filtered.length,
      totalInflow,
      totalOutflow,
      netCash
    };
  }

  // ==========================================
  // التقارير الدورية وساعات الذروة (Periodic Analytics & Peak Hours)
  // ==========================================
  getPeriodicAnalytics(period = "daily") {
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const orders = this.state.orders || [];
    const expenses = this.state.expenses || [];

    let filteredOrders = [];
    let filteredExpenses = [];
    let periodLabel = "";
    let breakdown = [];

    if (period === "daily") {
      periodLabel = `تقرير اليوم (${now.toLocaleDateString("ar-EG")})`;
      filteredOrders = orders.filter(o => o.createdAt && o.createdAt.startsWith(todayStr));
      if (filteredOrders.length === 0 && orders.length > 0) {
        const latestDate = orders[0].createdAt.split("T")[0];
        filteredOrders = orders.filter(o => o.createdAt && o.createdAt.startsWith(latestDate));
        filteredExpenses = expenses.filter(e => e.date && e.date.startsWith(latestDate));
        periodLabel = `تقرير تشغيل اليوم (${latestDate})`;
      } else {
        filteredExpenses = expenses.filter(e => e.date && e.date.startsWith(todayStr));
      }

      const morning = filteredOrders.filter(o => { const h = new Date(o.createdAt).getHours(); return h >= 8 && h < 13; });
      const afternoon = filteredOrders.filter(o => { const h = new Date(o.createdAt).getHours(); return h >= 13 && h < 17; });
      const evening = filteredOrders.filter(o => { const h = new Date(o.createdAt).getHours(); return h >= 17; });

      breakdown = [
        { label: "الفترة الصباحية (8 ص - 1 م)", count: morning.length, revenue: morning.reduce((s, o) => s + (Number(o.paidAmount) || 0), 0) },
        { label: "فترة الظهيرة (1 م - 5 م)", count: afternoon.length, revenue: afternoon.reduce((s, o) => s + (Number(o.paidAmount) || 0), 0) },
        { label: "الفترة المسائية (5 م - 11 م)", count: evening.length, revenue: evening.reduce((s, o) => s + (Number(o.paidAmount) || 0), 0) }
      ];
    } else if (period === "weekly") {
      periodLabel = "التقرير الأسبوعي (آخر 7 أيام)";
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filteredOrders = orders.filter(o => new Date(o.createdAt) >= weekAgo);
      if (filteredOrders.length === 0) filteredOrders = orders.slice(0, 15);
      filteredExpenses = expenses.filter(e => new Date(e.date) >= weekAgo);

      const daysArabic = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dStr = d.toISOString().split("T")[0];
        const dayOrders = orders.filter(o => o.createdAt && o.createdAt.startsWith(dStr));
        const dayRev = dayOrders.reduce((s, o) => s + (Number(o.paidAmount) || 0), 0);
        breakdown.push({
          label: `${daysArabic[d.getDay()]} (${d.getDate()}/${d.getMonth() + 1})`,
          count: dayOrders.length,
          revenue: dayRev
        });
      }
    } else if (period === "monthly") {
      const monthPrefix = todayStr.slice(0, 7);
      periodLabel = `التقرير الشهري (${now.toLocaleDateString("ar-EG", { month: "long", year: "numeric" })})`;
      filteredOrders = orders.filter(o => o.createdAt && o.createdAt.startsWith(monthPrefix));
      if (filteredOrders.length === 0) filteredOrders = orders;
      filteredExpenses = expenses.filter(e => e.date && e.date.startsWith(monthPrefix));

      for (let w = 1; w <= 4; w++) {
        const startDay = (w - 1) * 7 + 1;
        const endDay = w * 7;
        const wOrders = filteredOrders.filter(o => {
          const day = new Date(o.createdAt).getDate();
          return day >= startDay && (w === 4 ? day <= 31 : day <= endDay);
        });
        breakdown.push({
          label: `الأسبوع ${w} (${startDay}-${Math.min(endDay, 30)})`,
          count: wOrders.length,
          revenue: wOrders.reduce((s, o) => s + (Number(o.paidAmount) || 0), 0)
        });
      }
    } else if (period === "yearly") {
      const yearPrefix = todayStr.slice(0, 4);
      periodLabel = `التقرير السنوي لعام (${now.getFullYear()})`;
      filteredOrders = orders.filter(o => o.createdAt && o.createdAt.startsWith(yearPrefix));
      if (filteredOrders.length === 0) filteredOrders = orders;
      filteredExpenses = expenses.filter(e => e.date && e.date.startsWith(yearPrefix));

      const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
      months.forEach((mName, mIdx) => {
        const mKey = `${yearPrefix}-${String(mIdx + 1).padStart(2, "0")}`;
        const mOrders = filteredOrders.filter(o => o.createdAt && o.createdAt.startsWith(mKey));
        breakdown.push({
          label: mName,
          count: mOrders.length,
          revenue: mOrders.reduce((s, o) => s + (Number(o.paidAmount) || 0), 0)
        });
      });
    }

    const totalOrders = filteredOrders.length;
    const totalRevenue = filteredOrders.reduce((sum, o) => sum + (Number(o.paidAmount) || 0), 0);
    const totalInvoiced = filteredOrders.reduce((sum, o) => sum + (Number(o.netAmount) || 0), 0);
    const totalRemaining = filteredOrders.reduce((sum, o) => sum + (Number(o.remainingAmount) || 0), 0);
    const totalExpenses = filteredExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    const netProfit = totalRevenue - totalExpenses;
    const avgOrderValue = totalOrders > 0 ? Math.round(totalInvoiced / totalOrders) : 0;
    const completedCount = filteredOrders.filter(o => o.status === "validated").length;

    const testCounts = {};
    filteredOrders.forEach(o => {
      (o.testsRequested || []).forEach(tId => {
        testCounts[tId] = (testCounts[tId] || 0) + 1;
      });
    });
    const topTests = Object.entries(testCounts)
      .map(([id, count]) => {
        const t = this.state.tests.find(item => item.id === id) || { code: id, nameAr: id, price: 0 };
        return { ...t, count, totalVal: count * (t.price || 0) };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      period,
      periodLabel,
      totalOrders,
      totalRevenue,
      totalInvoiced,
      totalRemaining,
      totalExpenses,
      netProfit,
      avgOrderValue,
      completedCount,
      completionRate: totalOrders > 0 ? Math.round((completedCount / totalOrders) * 100) : 100,
      breakdown,
      topTests
    };
  }

  getPeakHoursAnalytics() {
    const orders = this.state.orders || [];
    
    const hoursData = [];
    for (let h = 8; h <= 23; h++) {
      hoursData.push({
        hour: h,
        label: (h > 12 ? (h - 12) + " م" : (h === 12 ? "12 م" : h + " ص")),
        fullTime: `${String(h).padStart(2, "0")}:00`,
        count: 0,
        revenue: 0
      });
    }

    orders.forEach(order => {
      if (order.createdAt) {
        const d = new Date(order.createdAt);
        const h = d.getHours();
        const slot = hoursData.find(item => item.hour === h);
        if (slot) {
          slot.count++;
          slot.revenue += (Number(order.paidAmount) || 0);
        }
      }
    });

    let maxHour = hoursData[0];
    hoursData.forEach(item => {
      if (item.count > maxHour.count) {
        maxHour = item;
      }
    });

    const totalOrders = orders.length || 1;
    const maxCount = Math.max(...hoursData.map(h => h.count), 1);

    hoursData.forEach(item => {
      item.percentage = Math.round((item.count / totalOrders) * 100);
      item.barHeight = Math.max(12, Math.round((item.count / maxCount) * 100));
      item.isPeak = item.hour === maxHour.hour && maxHour.count > 0;
      if (item.count >= 3) item.trafficLevel = "ذروة وازدحام مرتفع 🔥";
      else if (item.count >= 1) item.trafficLevel = "نشاط متوسط ⚡";
      else item.trafficLevel = "إقبال هادئ ☕";
    });

    const morningShift = hoursData.filter(h => h.hour >= 8 && h.hour < 14).reduce((s, h) => s + h.count, 0);
    const eveningShift = hoursData.filter(h => h.hour >= 14 && h.hour <= 23).reduce((s, h) => s + h.count, 0);

    return {
      hoursData,
      peakHour: maxHour,
      peakHourLabel: maxHour && maxHour.count > 0 ? `${maxHour.label} (${maxHour.count} زيارات)` : "لا توجد زيارات كافية بعد",
      morningShiftCount: morningShift,
      eveningShiftCount: eveningShift,
      busiestShift: morningShift >= eveningShift ? "الفترة الصباحية (سحب العينات والصيام)" : "الفترة المسائية (العيادات الخارجية)",
      recommendation: maxHour && maxHour.count > 0
        ? `ساعة الذروة اليومية القصوى هي (${maxHour.label}). يُوصى بتوفير كادر تمريض واستقبال إضافي خلال هذه الساعة لتسريع سحب العينات وتجنب تكدس المرضى.`
        : "ساعات العمل موزعة بانتظام دون فترات ازدحام حرجة."
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
