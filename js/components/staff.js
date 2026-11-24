/**
 * نظام إدارة المختبرات الطبية - LabCore Pro
 * موديول إدارة فريق العمل وتوزيع الصلاحيات (Staff & RBAC Component)
 */

window.StaffComponent = {
  render() {
    const container = document.getElementById("view-staff");
    if (!container) return;

    const staffList = window.store.state.staff || [];
    const roles = window.store.state.roles || [];
    const currentUser = window.store.getCurrentUser();

    container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <i data-lucide="shield-check"></i>
            <span>إدارة فريق العمل وتوزيع الصلاحيات (Staff & Permissions)</span>
          </div>
          <button id="btn-add-staff-modal" class="btn btn-primary btn-sm">
            <i data-lucide="user-plus"></i>
            <span>إضافة موظف جديد</span>
          </button>
        </div>

        <!-- بطاقات أدوار وصلاحيات العمل -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:16px; margin-bottom:24px;">
          ${roles.map(r => {
            const count = staffList.filter(s => s.role === r.id).length;
            return `
              <div style="background:var(--bg-tertiary); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:16px; border-right:4px solid ${r.color};">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                  <strong style="color:var(--text-primary); font-size:0.95rem;">${r.title}</strong>
                  <span class="badge badge-info" style="font-size:0.75rem;">${count} موظف</span>
                </div>
                <div style="font-size:0.78rem; color:var(--text-muted); line-height:1.5;">
                  الصلاحيات: ${r.permissions.length} شاشات ومهام مسموحة
                </div>
              </div>
            `;
          }).join("")}
        </div>

        <!-- جدول موظفي المختبر -->
        <div class="table-responsive" style="margin-bottom:28px;">
          <table class="data-table">
            <thead>
              <tr>
                <th>كود الموظف</th>
                <th>اسم الموظف بالكامل</th>
                <th>اسم المستخدم</th>
                <th>الدور / المستوى الوظيفي</th>
                <th>الهاتف والبريد</th>
                <th>الحالة</th>
                <th style="text-align:center;">إجراءات وتسجيل الدخول</th>
              </tr>
            </thead>
            <tbody>
              ${staffList.map(member => {
                const roleObj = roles.find(r => r.id === member.role) || { title: member.role, color: "var(--primary)" };
                const isCurrent = member.id === currentUser.id;

                return `
                  <tr style="${isCurrent ? 'background-color:var(--primary-light);' : ''}">
                    <td><strong style="font-family:var(--font-mono);">${member.id}</strong></td>
                    <td>
                      <strong>${member.name}</strong>
                      ${isCurrent ? '<span class="badge badge-success" style="margin-right:6px; font-size:0.7rem;">أنت الآن (المستخدم النشط)</span>' : ''}
                    </td>
                    <td><code>@${member.username}</code></td>
                    <td>
                      <span class="badge" style="background-color:rgba(2, 132, 199, 0.1); color:${roleObj.color}; border:1px solid ${roleObj.color};">
                        ${roleObj.title}
                      </span>
                    </td>
                    <td style="font-size:0.85rem;">
                      <div>${member.phone || '-'}</div>
                      <small style="color:var(--text-muted);">${member.email || ''}</small>
                    </td>
                    <td>
                      <span class="badge ${member.status === 'active' ? 'badge-success' : 'badge-danger'}">
                        ${member.status === 'active' ? 'نشط' : 'معطل'}
                      </span>
                    </td>
                    <td style="text-align:center;">
                      <div style="display:inline-flex; gap:6px; align-items:center;">
                        <button class="btn btn-sm btn-outline btn-customize-permissions" data-id="${member.id}" title="ضبط وتخصيص صلاحيات الوصول" style="font-size:0.78rem; padding:4px 10px; color:var(--primary); border-color:var(--primary);">
                          <i data-lucide="shield-check" style="width:13px;height:13px;"></i>
                          <span>تخصيص الصلاحيات</span>
                        </button>

                        ${!isCurrent ? `
                          <button class="btn btn-sm btn-outline btn-switch-to-user" data-id="${member.id}" title="تجربة النظام بصلاحية هذا المستخدم" style="font-size:0.78rem; padding:4px 10px;">
                            <i data-lucide="log-in" style="width:13px;height:13px;"></i>
                            <span>دخول</span>
                          </button>
                        ` : ''}

                        <button class="action-icon-btn btn-toggle-staff-status" data-id="${member.id}" title="${member.status === 'active' ? 'تعطيل الحساب' : 'تنشيط الحساب'}" style="width:30px; height:30px;">
                          <i data-lucide="${member.status === 'active' ? 'user-x' : 'user-check'}" style="width:14px;height:14px; color:${member.status === 'active' ? 'var(--warning)' : 'var(--success)'};"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>

        <!-- مصفوفة الصلاحيات التفصيلية (Permissions Matrix) -->
        <div style="background-color:var(--bg-tertiary); padding:18px; border-radius:var(--radius-lg); border:1px solid var(--border-color);">
          <h4 style="font-weight:800; color:var(--primary); margin-bottom:12px; display:flex; align-items:center; gap:8px;">
            <i data-lucide="key"></i>
            <span>مصفوفة الصلاحيات والتحكم في الوصول (RBAC Matrix)</span>
          </h4>
          <p style="font-size:0.82rem; color:var(--text-muted); margin-bottom:14px;">
            تحدد هذه المصفوفة الشاشات والأزرار المسموح لكل دور وظيفي بالوصول إليها داخل النظام.
          </p>

          <div class="table-responsive">
            <table class="data-table" style="font-size:0.85rem; background:var(--bg-card);">
              <thead>
                <tr>
                  <th>الموديول / الوظيفة</th>
                  <th style="text-align:center;">مدير المختبر (Director)</th>
                  <th style="text-align:center;">أخصائي وفني المعمل (Technician)</th>
                  <th style="text-align:center;">موظف الاستقبال (Receptionist)</th>
                  <th style="text-align:center;">مسؤول الحسابات (Accountant)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>لوحة التحكم والإحصائيات الحية</strong></td>
                  <td style="text-align:center; color:var(--success); font-weight:800;">✓ كامل</td>
                  <td style="text-align:center; color:var(--success); font-weight:800;">✓ كامل</td>
                  <td style="text-align:center; color:var(--success); font-weight:800;">✓ كامل</td>
                  <td style="text-align:center; color:var(--success); font-weight:800;">✓ كامل</td>
                </tr>
                <tr>
                  <td><strong>الاستقبال وحجز الزيارات والفوترة</strong></td>
                  <td style="text-align:center; color:var(--success); font-weight:800;">✓ كامل</td>
                  <td style="text-align:center; color:var(--danger); font-weight:800;">✗ محجوب</td>
                  <td style="text-align:center; color:var(--success); font-weight:800;">✓ مسموح</td>
                  <td style="text-align:center; color:var(--success); font-weight:800;">✓ مسموح</td>
                </tr>
                <tr>
                  <td><strong>إدخال ومراجعة النتائج المخبرية</strong></td>
                  <td style="text-align:center; color:var(--success); font-weight:800;">✓ كامل</td>
                  <td style="text-align:center; color:var(--success); font-weight:800;">✓ مسموح (إدخال ومسودة)</td>
                  <td style="text-align:center; color:var(--danger); font-weight:800;">✗ محجوب</td>
                  <td style="text-align:center; color:var(--danger); font-weight:800;">✗ محجوب</td>
                </tr>
                <tr>
                  <td><strong>اعتماد النتائج رسمياً وقفل التقرير</strong></td>
                  <td style="text-align:center; color:var(--success); font-weight:800;">✓ مقتصر على المدير</td>
                  <td style="text-align:center; color:var(--danger); font-weight:800;">✗ غير مصرح</td>
                  <td style="text-align:center; color:var(--danger); font-weight:800;">✗ غير مصرح</td>
                  <td style="text-align:center; color:var(--danger); font-weight:800;">✗ غير مصرح</td>
                </tr>
                <tr>
                  <td><strong>معاينة وطباعة التقرير الطبي الرسمي A4</strong></td>
                  <td style="text-align:center; color:var(--success); font-weight:800;">✓ مسموح</td>
                  <td style="text-align:center; color:var(--success); font-weight:800;">✓ مسموح</td>
                  <td style="text-align:center; color:var(--success); font-weight:800;">✓ مسموح (للتسليم)</td>
                  <td style="text-align:center; color:var(--danger); font-weight:800;">✗ محجوب</td>
                </tr>
                <tr>
                  <td><strong>الخزينة والمصروفات والتعاقدات</strong></td>
                  <td style="text-align:center; color:var(--success); font-weight:800;">✓ كامل</td>
                  <td style="text-align:center; color:var(--danger); font-weight:800;">✗ محجوب</td>
                  <td style="text-align:center; color:var(--danger); font-weight:800;">✗ محجوب</td>
                  <td style="text-align:center; color:var(--success); font-weight:800;">✓ كامل</td>
                </tr>
                <tr>
                  <td><strong>إعدادات المعمل وهوية المنشأة</strong></td>
                  <td style="text-align:center; color:var(--success); font-weight:800;">✓ كامل</td>
                  <td style="text-align:center; color:var(--danger); font-weight:800;">✗ غير مصرح</td>
                  <td style="text-align:center; color:var(--danger); font-weight:800;">✗ غير مصرح</td>
                  <td style="text-align:center; color:var(--danger); font-weight:800;">✗ غير مصرح</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    this.initEventListeners();
  },

  initEventListeners() {
    const container = document.getElementById("view-staff");
    if (!container) return;

    // زر إضافة موظف جديد
    const addBtn = document.getElementById("btn-add-staff-modal");
    if (addBtn) {
      addBtn.addEventListener("click", () => this.showAddStaffModal());
    }

    // تبديل المستخدم الحالي
    container.querySelectorAll(".btn-switch-to-user").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const staff = window.store.switchUser(id);
        if (staff) {
          window.app.showToast(`تم تسجيل الدخول بصلاحية: ${staff.name}`, "success");
          window.app.updateUserInterfaceForRole();
          this.render();
        }
      });
    });

    // تعطيل أو تنشيط موظف
    container.querySelectorAll(".btn-toggle-staff-status").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const updated = window.store.toggleStaffStatus(id);
        if (updated) {
          window.app.showToast(`تم تغيير حالة حساب ${updated.name} إلى: ${updated.status === 'active' ? 'نشط' : 'معطل'}`, "info");
          this.render();
        }
      });
    });

    // فتح نافذة تخصيص الصلاحيات
    container.querySelectorAll(".btn-customize-permissions").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        this.showPermissionsModal(id);
      });
    });
  },

  permissionGroups: [
    {
      id: "patients_reception",
      title: "الاستقبال وشؤون المرضى والزيارات",
      icon: "users",
      color: "#0284c7",
      bg: "rgba(2, 132, 199, 0.08)",
      items: [
        { key: "reception_view", label: "الاطلاع على ملفات وسجلات المرضى والبحث فيها" },
        { key: "reception", label: "تسجيل وقيد زيارات وتحاليل جديدة في السجلات" },
        { key: "reception_edit", label: "تعديل بيانات المرضى والزيارات والطلبات" },
        { key: "reception_discount", label: "تطبيق نسب الخصم المالي للزيارات" },
        { key: "reception_delete", label: "حذف وإلغاء الزيارات من سجلات المختبر", sensitive: true }
      ]
    },
    {
      id: "lab_testing",
      title: "الفحوصات والعمليات المخبرية",
      icon: "flask-conical",
      color: "#059669",
      bg: "rgba(5, 150, 105, 0.08)",
      items: [
        { key: "results_view", label: "الاطلاع على قائمة العينات والتحاليل اليومية" },
        { key: "results", label: "إدخال وتسجيل النتائج المخبرية في المنظومة" },
        { key: "validate_results", label: "اعتماد وتوقيع النتائج الطبية (مدير المختبر / استشاري)" },
        { key: "results_reopen", label: "إعادة فتح وتعديل نتائج معتمدة مسبقاً", sensitive: true },
        { key: "catalog", label: "إدارة وتعديل دليل التحاليل والباقات والأسعار" }
      ]
    },
    {
      id: "finance_safe",
      title: "الإدارة المالية والخزينة (سرية تامة)",
      icon: "wallet",
      color: "#e11d48",
      bg: "rgba(225, 29, 72, 0.08)",
      items: [
        { key: "finance", label: "الاطلاع على أرقام الخزينة والأرباح والإيرادات والمصروفات" },
        { key: "finance_collect", label: "تحرير سندات قبض وتحصيل مبالغ ومتبقيات من المرضى" },
        { key: "finance_expense", label: "تحرير سندات صرف المصروفات وشراء الكيماويات" },
        { key: "finance_audit", label: "الفحص والتدقيق المالي الشامل وكشف الحسابات" },
        { key: "finance_delete", label: "حذف وإلغاء السندات والحركات المالية", sensitive: true }
      ]
    },
    {
      id: "reports_printing",
      title: "التقارير الطبية والأرشيف والطباعة",
      icon: "printer",
      color: "#7c3aed",
      bg: "rgba(124, 58, 237, 0.08)",
      items: [
        { key: "medical-report", label: "استعراض وطباعة التقارير المخبرية الرسمية (A4)" },
        { key: "report_pdf", label: "تحميل وتصدير التقرير كملف PDF رقمي" },
        { key: "report_whatsapp", label: "إرسال إشعار جاهزية النتيجة عبر واتساب للمريض" },
        { key: "report_barcode", label: "طباعة باركود أنابيب العينات وإيصال الاستلام" }
      ]
    },
    {
      id: "contracts_insurance",
      title: "التعاقدات وشركات التأمين والنقابات",
      icon: "briefcase",
      color: "#d97706",
      bg: "rgba(217, 119, 6, 0.08)",
      items: [
        { key: "contracts_view", label: "الاطلاع على عقود التأمين والنقابات وقوائم الأسعار" },
        { key: "contracts_edit", label: "إضافة وتعديل جهات التعاقد ونسب الخصم والتحمل" },
        { key: "contracts_claims", label: "إصدار ومتابعة المطالبات المالية لجهات التعاقد" }
      ]
    },
    {
      id: "system_admin",
      title: "إدارة النظام وفريق العمل والإعدادات",
      icon: "settings",
      color: "#0d9488",
      bg: "rgba(13, 148, 136, 0.08)",
      items: [
        { key: "staff", label: "إدارة فريق العمل وإضافة وتعديل بيانات الموظفين" },
        { key: "staff_permissions", label: "ضبط وتخصيص صلاحيات الوصول للكوادر" },
        { key: "settings", label: "تعديل هوية وإعدادات المختبر وترويسة التقارير" },
        { key: "backup", label: "تصدير واستيراد النسخ الاحتياطية وإعادة الضبط" }
      ]
    }
  ],

  showPermissionsModal(memberId) {
    const member = (window.store.state.staff || []).find(s => s.id === memberId);
    if (!member) return;

    const roleObj = (window.store.state.roles || []).find(r => r.id === member.role) || { title: member.role, color: "var(--primary)" };
    const currentPerms = window.store.getUserPermissions(memberId);

    const modalTitle = document.getElementById("modal-title");
    const modalBody = document.getElementById("modal-body");
    const modalFooter = document.getElementById("modal-footer");

    modalTitle.innerHTML = `
      <div style="display:flex; align-items:center; gap:10px;">
        <i data-lucide="shield-check" style="color:var(--primary); width:24px; height:24px;"></i>
        <span>ضبط وتخصيص صلاحيات الوصول: ${member.name}</span>
        <span class="badge" style="background:rgba(2, 132, 199, 0.1); color:${roleObj.color}; border:1px solid ${roleObj.color}; font-size:0.75rem;">${roleObj.title}</span>
      </div>
    `;

    modalBody.innerHTML = `
      <div class="permissions-header-bar">
        <div style="display:flex; align-items:center; gap:8px; font-size:0.86rem; color:var(--text-secondary); font-weight:600;">
          <i data-lucide="info" style="color:var(--primary); width:18px; height:18px;"></i>
          <span>يمكنك تفعيل أو إلغاء أي صلاحية بشكل منفصل أدناه:</span>
        </div>
        <div style="display:flex; gap:8px;">
          <button type="button" id="btn-perm-select-all" class="btn btn-outline btn-sm">
            <i data-lucide="check-square" style="width:14px; height:14px;"></i>
            <span>تحديد الكل</span>
          </button>
          <button type="button" id="btn-perm-deselect-all" class="btn btn-outline btn-sm">
            <i data-lucide="square" style="width:14px; height:14px;"></i>
            <span>إلغاء التحديد</span>
          </button>
        </div>
      </div>

      <div class="permissions-grid">
        ${this.permissionGroups.map(group => `
          <div class="permission-card">
            <div class="permission-card-header" style="background-color:${group.bg}; color:${group.color};">
              <i data-lucide="${group.icon}" style="width:18px; height:18px;"></i>
              <span>${group.title}</span>
            </div>
            <div class="permission-card-body">
              ${group.items.map(item => {
                const isChecked = currentPerms.includes(item.key);
                return `
                  <label class="permission-item">
                    <input type="checkbox" class="perm-checkbox" value="${item.key}" ${isChecked ? 'checked' : ''} />
                    <span>
                      ${item.label}
                      ${item.sensitive ? '<span class="badge-sensitive">(إجراء حساس)</span>' : ''}
                    </span>
                  </label>
                `;
              }).join("")}
            </div>
          </div>
        `).join("")}
      </div>
    `;

    modalFooter.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; width:100%; flex-wrap:wrap; gap:12px;">
        <div style="font-size:0.8rem; color:var(--text-muted); display:flex; align-items:center; gap:6px;">
          <i data-lucide="sparkles" style="color:var(--primary); width:15px; height:15px;"></i>
          <span>تسري هذه الصلاحيات فوراً وتُحفظ في ملف الموظف في النظام</span>
        </div>
        <div style="display:flex; gap:8px;">
          <button type="button" id="btn-confirm-save-permissions" class="btn btn-primary btn-sm" style="box-shadow:0 2px 8px var(--primary-glow);">
            <i data-lucide="check"></i>
            <span>حفظ واعتماد الصلاحيات</span>
          </button>
          <button type="button" id="btn-cancel-permissions-modal" class="btn btn-outline btn-sm">
            <span>إلغاء</span>
          </button>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
    window.app.openModal("permissions-modal-dialog");

    // أحداث النافذة
    document.getElementById("btn-perm-select-all").addEventListener("click", () => {
      document.querySelectorAll(".perm-checkbox").forEach(cb => cb.checked = true);
    });

    document.getElementById("btn-perm-deselect-all").addEventListener("click", () => {
      document.querySelectorAll(".perm-checkbox").forEach(cb => cb.checked = false);
    });

    document.getElementById("btn-cancel-permissions-modal").addEventListener("click", () => {
      window.app.closeModal();
    });

    document.getElementById("btn-confirm-save-permissions").addEventListener("click", () => {
      const selected = [];
      document.querySelectorAll(".perm-checkbox:checked").forEach(cb => {
        selected.push(cb.value);
      });

      // دائماً إضافة dashboard للموظف النشط
      if (!selected.includes("dashboard")) selected.push("dashboard");

      window.store.updateStaffPermissions(memberId, selected);

      // إذا كان الموظف المعدل هو المستخدم النشط حالياً، تحديث الواجهة فوراً
      if (memberId === window.store.getCurrentUser().id) {
        window.app.updateUserInterfaceForRole();
      }

      window.app.closeModal();
      window.app.showToast(`تم حفظ وتحديث صلاحيات ${member.name} بنجاح (${selected.length} صلاحية مفعّلة)`, "success");
      this.render();
    });
  },

  showAddStaffModal() {
    const modalTitle = document.getElementById("modal-title");
    const modalBody = document.getElementById("modal-body");
    const modalFooter = document.getElementById("modal-footer");

    modalTitle.innerHTML = `<i data-lucide="user-plus" style="color:var(--primary);"></i> إضافة عضو جديد لفريق عمل المختبر`;

    modalBody.innerHTML = `
      <form id="form-new-staff">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">الاسم بالكامل *</label>
            <input type="text" id="new-staff-name" class="form-control" placeholder="مثال: د. حسام عبد الفتاح" required />
          </div>

          <div class="form-group">
            <label class="form-label">اسم المستخدم (Username) *</label>
            <input type="text" id="new-staff-username" class="form-control" placeholder="مثال: hossam_lab" required />
          </div>

          <div class="form-group">
            <label class="form-label">كلمة المرور للدخول *</label>
            <input type="password" id="new-staff-password" class="form-control" placeholder="123456" value="123456" required />
          </div>

          <div class="form-group">
            <label class="form-label">الدور الوظيفي ومستوى الصلاحية *</label>
            <select id="new-staff-role" class="form-control" required>
              <option value="technician">أخصائي تحاليل / فني معمل (رصد نتائج)</option>
              <option value="receptionist">موظف استقبال وخدمة عملاء (حجز وفوترة)</option>
              <option value="accountant">محاسب ومسؤول خزينة (مالية ومصروفات)</option>
              <option value="director">طبيب استشاري / مدير معمل (كامل الصلاحيات)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">رقم الهاتف / الواتساب</label>
            <input type="tel" id="new-staff-phone" class="form-control" placeholder="01xxxxxxxxx" />
          </div>

          <div class="form-group" style="grid-column: span 2;">
            <label class="form-label">البريد الإلكتروني الرسمي</label>
            <input type="email" id="new-staff-email" class="form-control" placeholder="name@royallab-eg.com" />
          </div>
        </div>
      </form>
    `;

    modalFooter.innerHTML = `
      <button type="button" id="btn-save-staff" class="btn btn-primary btn-sm">
        <i data-lucide="check"></i>
        <span>إضافة الموظف</span>
      </button>
      <button type="button" id="btn-cancel-staff-modal" class="btn btn-outline btn-sm">إلغاء</button>
    `;

    if (window.lucide) window.lucide.createIcons();
    window.app.openModal();

    document.getElementById("btn-cancel-staff-modal").addEventListener("click", () => window.app.closeModal());

    document.getElementById("btn-save-staff").addEventListener("click", () => {
      const name = document.getElementById("new-staff-name").value;
      const username = document.getElementById("new-staff-username").value;
      const password = document.getElementById("new-staff-password").value;
      const role = document.getElementById("new-staff-role").value;
      const phone = document.getElementById("new-staff-phone").value;
      const email = document.getElementById("new-staff-email").value;

      if (!name || !username) {
        window.app.showToast("يرجى إدخال اسم الموظف واسم المستخدم", "error");
        return;
      }

      window.store.addStaff({ name, username, password, role, phone, email });
      if (window.app) window.app.updateUserInterfaceForRole();
      window.app.showToast(`تمت إضافة الموظف ${name} بنجاح إلى فريق العمل`, "success");
      window.app.closeModal();
      this.render();
    });
  }
};
