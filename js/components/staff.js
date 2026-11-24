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
                      <div style="display:inline-flex; gap:6px;">
                        ${!isCurrent ? `
                          <button class="btn btn-sm btn-outline btn-switch-to-user" data-id="${member.id}" title="تجربة النظام بصلاحية هذا المستخدم" style="font-size:0.78rem; padding:4px 10px;">
                            <i data-lucide="log-in" style="width:13px;height:13px;"></i>
                            <span>دخول بصلاحيته</span>
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
      const role = document.getElementById("new-staff-role").value;
      const phone = document.getElementById("new-staff-phone").value;
      const email = document.getElementById("new-staff-email").value;

      if (!name || !username) {
        window.app.showToast("يرجى إدخال اسم الموظف واسم المستخدم", "error");
        return;
      }

      window.store.addStaff({ name, username, role, phone, email });
      if (window.app) window.app.updateUserInterfaceForRole();
      window.app.showToast(`تمت إضافة الموظف ${name} بنجاح إلى فريق العمل`, "success");
      window.app.closeModal();
      this.render();
    });
  }
};
