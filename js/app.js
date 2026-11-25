/**
 * نظام إدارة المختبرات الطبية - LabCore Pro
 * الموجه الرئيسي والمنسق العام للتطبيق (Application Orchestrator & Router)
 */

class LabApp {
  constructor() {
    this.currentView = "dashboard";
    this.toastTimer = null;
  }

  init() {
    // 1. تطبيق الثيم المحفوظ
    const savedTheme = window.store.state.theme || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
    this.updateThemeIcon(savedTheme);

    // تحديث اسم وشعار المعمل من الإعدادات المحفوظة
    if (window.store.state.labProfile && window.store.state.labProfile.nameAr) {
      const brandH1 = document.querySelector(".lab-brand-info h1");
      if (brandH1) brandH1.textContent = window.store.state.labProfile.nameAr;
      const loginLabTitle = document.getElementById("login-lab-title");
      if (loginLabTitle) loginLabTitle.textContent = window.store.state.labProfile.nameAr;
    }
    // تهيئة بيانات مدير المعمل (Topbar + Sidebar) عند التحميل
    this.syncLabProfileUI(window.store.state.labProfile);

    // 2. ربط المصادقة وبوابة تسجيل الدخول
    this.initAuth();

    // 3. ربط الساعة الحية
    this.startLiveClock();

    // 4. ربط أحداث القائمة الجانبية والشريط العلوي
    this.initNavigation();
    this.initThemeToggle();
    this.initBackupActions();
    this.initModals();
    this.initUserSwitcher();

    // 5. تطبيق الصلاحيات والمستخدم النشط
    this.updateUserInterfaceForRole();

    // 6. الاشتراك في تحديثات الحالة المركزية
    window.store.subscribe((state) => {
      this.updateSidebarBadges(state);
      // تحديث بيانات المعمل في كل أماكن الظهور عند تغيير labProfile
      this.syncLabProfileUI(state.labProfile);
      // تحديث لوحة التحكم فقط تلقائياً إذا كانت معروضة لتفادي إعادة بناء النماذج وشاشات الإدخال النشطة
      if (state.currentView === "dashboard" && window.store.isAuthenticated()) {
        window.DashboardComponent.render();
      }
    });

    // 7. إذا كان المستخدم مسجلاً، توجيهه للشاشة الافتراضية
    if (window.store.isAuthenticated()) {
      this.navigateTo(window.store.state.currentView || "dashboard");
      this.updateSidebarBadges(window.store.state);
    }
  }

  // ==========================================
  // بوابة تسجيل الدخول وإدارة الجلسات (Authentication)
  // ==========================================
  initAuth() {
    const loginForm = document.getElementById("login-form");
    const usernameInput = document.getElementById("login-username");
    const passwordInput = document.getElementById("login-password");
    const togglePwdBtn = document.getElementById("btn-toggle-login-pwd");
    const iconEye = document.getElementById("icon-pwd-eye");

    // التحقق من الجلسة الحالية
    if (window.store.isAuthenticated()) {
      this.hideLogin();
    } else {
      this.showLogin();
    }

    // زر إظهار/إخفاء كلمة المرور
    if (togglePwdBtn && passwordInput) {
      togglePwdBtn.addEventListener("click", () => {
        const isPwd = passwordInput.getAttribute("type") === "password";
        passwordInput.setAttribute("type", isPwd ? "text" : "password");
        if (iconEye) {
          iconEye.setAttribute("data-lucide", isPwd ? "eye-off" : "eye");
          if (window.lucide) window.lucide.createIcons();
        }
      });
    }

    // إرسال نموذج تسجيل الدخول
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = usernameInput ? usernameInput.value : "";
        const password = passwordInput ? passwordInput.value : "";

        const result = window.store.authenticate(username, password);
        if (result.success) {
          this.hideLogin();
          this.updateUserInterfaceForRole();
          this.navigateTo(window.store.state.currentView || "dashboard");
          this.showToast(`مرحباً بك ${result.user.name} في نظام المختبر`, "success");
          if (passwordInput) passwordInput.value = "";
        } else {
          this.showToast(result.message || "بيانات الدخول غير صحيحة", "error");
        }
      });
    }

    // أزرار الدخول السريع لاختبار الصلاحيات
    document.querySelectorAll(".quick-login-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const u = btn.getAttribute("data-user");
        const p = btn.getAttribute("data-pass");
        if (usernameInput) usernameInput.value = u;
        if (passwordInput) passwordInput.value = p;
        
        const result = window.store.authenticate(u, p);
        if (result.success) {
          this.hideLogin();
          this.updateUserInterfaceForRole();
          this.navigateTo(window.store.state.currentView || "dashboard");
          this.showToast(`تم تسجيل الدخول بصلاحية: ${result.user.name}`, "success");
        } else {
          this.showToast(result.message, "error");
        }
      });
    });

    // أزرار تسجيل الخروج
    const handleLogout = () => {
      window.store.logout();
      this.showLogin();
      this.showToast("تم تسجيل الخروج من النظام بنجاح", "info");
    };

    const logoutSidebar = document.getElementById("btn-logout-sidebar");
    if (logoutSidebar) {
      logoutSidebar.addEventListener("click", handleLogout);
    }

    const logoutTopbar = document.getElementById("btn-logout-topbar");
    if (logoutTopbar) {
      logoutTopbar.addEventListener("click", handleLogout);
    }
  }

  showLogin() {
    const loginPortal = document.getElementById("login-portal");
    const mainLayout = document.getElementById("main-app-layout");
    if (loginPortal) loginPortal.style.display = "flex";
    if (mainLayout) mainLayout.style.display = "none";
    if (window.lucide) window.lucide.createIcons();
  }

  hideLogin() {
    const loginPortal = document.getElementById("login-portal");
    const mainLayout = document.getElementById("main-app-layout");
    if (loginPortal) loginPortal.style.display = "none";
    if (mainLayout) mainLayout.style.display = "flex";
    if (window.lucide) window.lucide.createIcons();
  }

  // ==========================================
  // الساعة الحية
  // ==========================================
  startLiveClock() {
    const clockEl = document.getElementById("live-clock");
    const updateTime = () => {
      if (clockEl) {
        const now = new Date();
        clockEl.textContent = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + " | " + now.toLocaleDateString('ar-EG');
      }
    };
    updateTime();
    setInterval(updateTime, 1000);
  }

  // ==========================================
  // التنقل بين الشاشات (View Navigation)
  // ==========================================
  initNavigation() {
    // عناصر الشريط الجانبي
    document.querySelectorAll(".nav-item").forEach(item => {
      item.addEventListener("click", () => {
        const targetView = item.getAttribute("data-view");
        if (targetView) {
          window.store.setView(targetView);
        }
      });
    });

    // زر الحجز السريع بالشريط العلوي
    const topbarNewPatientBtn = document.getElementById("topbar-new-patient-btn");
    if (topbarNewPatientBtn) {
      topbarNewPatientBtn.addEventListener("click", () => {
        window.store.setView("reception");
      });
    }

    // زر القائمة في الشاشات الصغيرة
    const mobileToggleBtn = document.getElementById("mobile-toggle-btn");
    const sidebar = document.querySelector(".sidebar");
    if (mobileToggleBtn && sidebar) {
      mobileToggleBtn.addEventListener("click", () => {
        sidebar.classList.toggle("open");
      });
    }
  }

  navigateTo(viewName, syncStore = true) {
    // التحقق من صلاحيات الوصول للموديول
    if (viewName !== "dashboard" && !window.store.hasPermission(viewName)) {
      this.showToast(`عفواً، حسابك الحالي ليس لديه صلاحية الوصول لشاشة (${viewName})`, "error");
      viewName = "dashboard";
    }

    this.currentView = viewName;
    if (syncStore) {
      window.store.state.currentView = viewName;
    }

    // تحديث رابط الشريط الجانبي النشط
    document.querySelectorAll(".nav-item").forEach(item => {
      if (item.getAttribute("data-view") === viewName) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    // إخفاء كل الشاشات وإظهار الشاشة المطلوبة
    document.querySelectorAll(".app-view").forEach(section => {
      section.style.display = "none";
    });

    const targetSection = document.getElementById(`view-${viewName}`);
    if (targetSection) {
      targetSection.style.display = "block";
    }

    // تحديث عنوان الصفحة
    const titleEl = document.getElementById("current-page-title");
    const titlesMap = {
      "dashboard": "لوحة التحكم والمؤشرات الحية",
      "reception": "الاستقبال وحجز الزيارات والفوترة",
      "catalog": "دليل التحاليل الطبية والباقات",
      "results": "إدخال ومراجعة النتائج المخبرية والاعتماد",
      "medical-report": "التقرير الطبي والطباعة الرسمية (A4)",
      "finance": "الخزينة والمقبوضات والمصروفات والتعاقدات",
      "settings": "إعدادات وهوية المختبر الطبي",
      "staff": "إدارة فريق العمل وتوزيع الصلاحيات (RBAC)"
    };
    if (titleEl) {
      titleEl.textContent = titlesMap[viewName] || "نظام المختبرات الطبية";
    }

    // استدعاء دالة العرض Render الخاصة بالموديول
    switch (viewName) {
      case "dashboard":
        window.DashboardComponent.render();
        break;
      case "reception":
        window.ReceptionComponent.render();
        break;
      case "catalog":
        window.CatalogComponent.render();
        break;
      case "results":
        window.LabResultsComponent.render();
        break;
      case "medical-report":
        window.MedicalReportComponent.render();
        break;
      case "finance":
        window.FinanceComponent.render();
        break;
      case "settings":
        window.SettingsComponent.render();
        break;
      case "staff":
        window.StaffComponent.render();
        break;
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // ==========================================
  // مزامنة بيانات المعمل في كل أماكن الظهور (Live Lab Profile Sync)
  // ==========================================
  syncLabProfileUI(lab) {
    if (!lab) return;
    // اسم المعمل في الشريط الجانبي
    const brandH1 = document.querySelector('.lab-brand-info h1');
    if (brandH1) brandH1.textContent = lab.nameAr || '';
    const brandP = document.querySelector('.lab-brand-info p');
    if (brandP) brandP.textContent = lab.nameEn || 'إدارة المختبرات الطبية الذكية';
    // اسم مدير المعمل في الشريط الجانبي
    const sidebarDirector = document.getElementById('sidebar-lab-director');
    if (sidebarDirector) sidebarDirector.textContent = lab.directorName ? ('د. ' + lab.directorName + ' — مدير المعمل') : '';
    // اسم مدير المعمل في الـ Topbar (صاحب المنشأة)
    const topbarDirectorName = document.getElementById('topbar-lab-director-name');
    if (topbarDirectorName) topbarDirectorName.textContent = lab.directorName || '';
    // عنوان شاشة تسجيل الدخول
    const loginTitle = document.getElementById('login-lab-title');
    if (loginTitle) loginTitle.textContent = lab.nameAr || '';
    // معاينة حية في صفحة الإعدادات (إن كانت مفتوحة)
    const previewNameAr = document.getElementById('preview-lab-name-ar');
    if (previewNameAr) previewNameAr.textContent = lab.nameAr || '';
    const previewNameEn = document.getElementById('preview-lab-name-en');
    if (previewNameEn) previewNameEn.textContent = lab.nameEn || '';
    const previewPhone = document.getElementById('preview-lab-phone');
    if (previewPhone) previewPhone.textContent = lab.phone || '';
    const previewAddress = document.getElementById('preview-lab-address');
    if (previewAddress) previewAddress.textContent = lab.address || '';
    const previewDirector = document.getElementById('preview-lab-director');
    if (previewDirector) previewDirector.textContent = lab.directorName || '';
    const previewTitle = document.getElementById('preview-lab-director-title');
    if (previewTitle) previewTitle.textContent = lab.directorTitle || '';
    const previewFooter = document.getElementById('preview-lab-footer');
    if (previewFooter) previewFooter.textContent = lab.footerNotice || '';
    // عنوان نافذة المتصفح
    document.title = (lab.nameAr || 'LabCore Pro') + ' | نظام إدارة المختبرات الطبية';
  }

  updateSidebarBadges(state) {
    const todayStr = new Date().toISOString().split("T")[0];
    const todayOrders = state.orders.filter(o => o.createdAt && o.createdAt.startsWith(todayStr));
    const pendingCount = state.orders.filter(o => o.status === "pending").length;

    const todayOrdersBadge = document.getElementById("badge-today-orders");
    if (todayOrdersBadge) todayOrdersBadge.textContent = todayOrders.length;

    const pendingBadge = document.getElementById("badge-pending-results");
    if (pendingBadge) pendingBadge.textContent = pendingCount;
  }

  // ==========================================
  // تبديل الوضع الليلي / النهاري (Theme Engine)
  // ==========================================
  initThemeToggle() {
    const btn = document.getElementById("theme-toggle-btn");
    if (!btn) return;

    btn.addEventListener("click", () => {
      const current = window.store.state.theme || "dark";
      const next = current === "dark" ? "light" : "dark";
      window.store.setTheme(next);
      this.updateThemeIcon(next);
      this.showToast(`تم التبديل إلى الوضع ${next === 'dark' ? 'الليلي' : 'النهاري'}`, "info");
    });
  }

  updateThemeIcon(theme) {
    const iconContainer = document.getElementById("theme-icon");
    if (iconContainer) {
      iconContainer.setAttribute("data-lucide", theme === "dark" ? "sun" : "moon");
      if (window.lucide) window.lucide.createIcons();
    }
  }

  // ==========================================
  // فريق العمل والصلاحيات ومبدّل المستخدمين (RBAC)
  // ==========================================
  initUserSwitcher() {
    const select = document.getElementById("topbar-user-switch-select");
    if (!select) return;

    select.addEventListener("change", (e) => {
      const selectedId = e.target.value;
      const user = window.store.switchUser(selectedId);
      if (user) {
        this.updateUserInterfaceForRole();
        this.showToast(`تم التبديل إلى المستخدم: ${user.name}`, "info");
      }
    });
  }

  updateUserInterfaceForRole() {
    const user = window.store.getCurrentUser();
    const role = window.store.getCurrentRole();
    if (!user || !role) return;

    // تحديث بطاقة المستخدم النشط في الشريط العلوي
    const avatarEl = document.getElementById("topbar-user-avatar");
    const nameEl = document.getElementById("topbar-user-name");
    const roleEl = document.getElementById("topbar-user-role");
    const select = document.getElementById("topbar-user-switch-select");

    const roleTitle = role.title ? role.title.split('/')[0].trim() : (role.id || "مستخدم");

    if (avatarEl) avatarEl.textContent = (user.name || "م").trim().charAt(0);
    if (nameEl) nameEl.textContent = user.name;
    if (roleEl) roleEl.textContent = roleTitle;

    // تحديث بطاقة المستخدم النشط في الشريط الجانبي
    const sidebarNameEl = document.getElementById("sidebar-logged-user-name");
    const sidebarRoleEl = document.getElementById("sidebar-logged-user-role");
    if (sidebarNameEl) sidebarNameEl.textContent = user.name;
    if (sidebarRoleEl) sidebarRoleEl.textContent = roleTitle;

    // تحديث خيارات القائمة المنسدلة
    if (select) {
      const staffList = window.store.state.staff || [];
      select.innerHTML = staffList.map(s => {
        const r = (window.store.state.roles || []).find(roleItem => roleItem.id === s.role) || { title: s.role };
        return `<option value="${s.id}" ${s.id === user.id ? 'selected' : ''}>${s.name} [${r.title.split('/')[0].trim()}]</option>`;
      }).join("");
    }

    // إظهار/إخفاء زر الحجز السريع في الشريط العلوي بحسب صلاحية الاستقبال
    const topbarNewPatientBtn = document.getElementById("topbar-new-patient-btn");
    if (topbarNewPatientBtn) {
      topbarNewPatientBtn.style.display = window.store.hasPermission("reception") ? "inline-flex" : "none";
    }

    // إظهار/إخفاء روابط القائمة الجانبية بحسب الصلاحيات
    document.querySelectorAll(".nav-item").forEach(item => {
      const view = item.getAttribute("data-view");
      if (view === "dashboard") {
        item.style.display = "flex";
      } else {
        const isPermitted = window.store.hasPermission(view);
        item.style.display = isPermitted ? "flex" : "none";
      }
    });

    // إذا كان الموظف حالياً في صفحة غير مصرح له بها، نحوله إلى dashboard
    if (this.currentView !== "dashboard" && !window.store.hasPermission(this.currentView)) {
      this.navigateTo("dashboard");
    }
  }

  // ==========================================
  // النسخ الاحتياطي والاستيراد (Backup & Restore)
  // ==========================================
  initBackupActions() {
    const btnExport = document.getElementById("btn-export-backup");
    if (btnExport) {
      btnExport.addEventListener("click", () => {
        window.store.exportBackupJSON();
        this.showToast("تم تصدير ملف النسخة الاحتياطية بنجاح", "success");
      });
    }

    const btnImportTrigger = document.getElementById("btn-import-backup-trigger");
    const inputImport = document.getElementById("input-import-backup");
    if (btnImportTrigger && inputImport) {
      btnImportTrigger.addEventListener("click", () => {
        inputImport.click();
      });

      inputImport.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          const success = window.store.importBackupJSON(event.target.result);
          if (success) {
            this.showToast("تم استيراد كافة البيانات بنجاح وتحديث النظام", "success");
            this.navigateTo(this.currentView);
          } else {
            this.showToast("فشل استيراد الملف، تأكد من صحة ملف JSON", "error");
          }
        };
        reader.readAsText(file);
      });
    }

    const btnReset = document.getElementById("btn-reset-demo");
    if (btnReset) {
      btnReset.addEventListener("click", () => {
        if (confirm("هل تريد استعادة البيانات التأسيسية وإعادة ضبط قاعدة البيانات؟")) {
          window.store.resetToSeedData();
          this.showToast("تمت استعادة البيانات التأسيسية بنجاح", "success");
          this.navigateTo("dashboard");
        }
      });
    }
  }

  // ==========================================
  // النوافذ المنبثقة والإشعارات (Modals & Toasts)
  // ==========================================
  initModals() {
    const modal = document.getElementById("app-modal");
    const closeBtn = document.getElementById("modal-close-btn");

    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.closeModal());
    }

    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          this.closeModal();
        }
      });
    }
  }

  openModal(customClass = null) {
    const modal = document.getElementById("app-modal");
    if (modal) {
      const container = modal.querySelector(".modal-container");
      if (container) {
        container.className = "modal-container" + (customClass ? " " + customClass : "");
      }
      modal.classList.add("active");
    }
  }

  closeModal() {
    const modal = document.getElementById("app-modal");
    if (modal) {
      const container = modal.querySelector(".modal-container");
      if (container) {
        container.className = "modal-container";
      }
      modal.classList.remove("active");
    }
  }

  showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    
    let iconName = "info";
    if (type === "success") iconName = "check-circle";
    if (type === "error") iconName = "alert-triangle";

    toast.innerHTML = `
      <i data-lucide="${iconName}"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(20px)";
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
}

// تهيئة وتشغيل التطبيق عند اكتمال تحميل DOM
document.addEventListener("DOMContentLoaded", () => {
  window.app = new LabApp();
  window.app.init();
});

// ==========================================================================
// محرك الطباعة المركزي الموحد (Unified Dynamic Print Engine)
// يضمن طباعة كافة التقارير والإيصالات دون صفحات بيضاء أو تداخل شاشات
// ==========================================================================
window.printDocument = function(mode = 'auto') {
  document.body.classList.remove('print-mode-receipt', 'print-mode-analytics', 'print-mode-audit', 'print-mode-report');

  const modal = document.getElementById("app-modal");
  const receiptContent = document.getElementById("receipt-printable-content");
  const isReceiptOpen = modal && modal.classList.contains("active") && receiptContent;

  if (mode === 'receipt' || (mode === 'auto' && isReceiptOpen)) {
    document.body.classList.add('print-mode-receipt');
  } else if (mode === 'analytics' || (mode === 'auto' && window.store && window.store.state.currentView === 'dashboard')) {
    document.body.classList.add('print-mode-analytics');
  } else if (mode === 'audit' || (mode === 'auto' && window.store && window.store.state.currentView === 'finance')) {
    document.body.classList.add('print-mode-audit');
  } else {
    // Medical Report: ensure rendered
    if (window.MedicalReportComponent && window.store) {
      if (window.store.state.currentView !== 'medical-report') {
        window.store.setView('medical-report');
      } else {
        window.MedicalReportComponent.render();
      }
    }
    document.body.classList.add('print-mode-report');
  }

  setTimeout(() => {
    window.print();
  }, 60);

  const cleanup = () => {
    document.body.classList.remove('print-mode-receipt', 'print-mode-analytics', 'print-mode-audit', 'print-mode-report');
    window.removeEventListener('afterprint', cleanup);
  };
  window.addEventListener('afterprint', cleanup);
  setTimeout(cleanup, 2500);
};

window.addEventListener('beforeprint', () => {
  const modal = document.getElementById("app-modal");
  const receiptContent = document.getElementById("receipt-printable-content");
  if (modal && modal.classList.contains("active") && receiptContent) {
    document.body.classList.add('print-mode-receipt');
  } else if (window.store && window.store.state.currentView === 'dashboard') {
    document.body.classList.add('print-mode-analytics');
  } else if (window.store && window.store.state.currentView === 'finance') {
    document.body.classList.add('print-mode-audit');
  } else {
    if (window.MedicalReportComponent && window.store && window.store.state.currentView !== 'medical-report') {
      window.MedicalReportComponent.render();
    }
    document.body.classList.add('print-mode-report');
  }
});

window.addEventListener('afterprint', () => {
  document.body.classList.remove('print-mode-receipt', 'print-mode-analytics', 'print-mode-audit', 'print-mode-report');
});

