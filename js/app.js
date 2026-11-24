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
    }

    // 2. ربط الساعة الحية
    this.startLiveClock();

    // 3. ربط أحداث القائمة الجانبية والشريط العلوي
    this.initNavigation();
    this.initThemeToggle();
    this.initBackupActions();
    this.initModals();

    // 4. الاشتراك في تحديثات الحالة المركزية
    window.store.subscribe((state) => {
      this.updateSidebarBadges(state);
      // تحديث الشاشة الحالية والبيانات عند أي تغيير بالحالة
      if (state.currentView) {
        this.navigateTo(state.currentView, false);
      }
    });

    // 5. التوجيه إلى الشاشة الافتراضية
    this.navigateTo(window.store.state.currentView || "dashboard");
    this.updateSidebarBadges(window.store.state);
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
      "settings": "إعدادات وهوية المختبر الطبي"
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
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
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

  openModal() {
    const modal = document.getElementById("app-modal");
    if (modal) modal.classList.add("active");
  }

  closeModal() {
    const modal = document.getElementById("app-modal");
    if (modal) modal.classList.remove("active");
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
