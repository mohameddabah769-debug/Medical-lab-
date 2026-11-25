/**
 * نظام إدارة المختبرات الطبية - LabCore Pro
 * موديول الحسابات والخزينة والمصروفات والتعاقدات (Finance & Expenses Component)
 */

window.FinanceComponent = {
  activeSubTab: "debts", // 'debts' | 'expenses' | 'contracts' | 'audit'
  auditFilters: {
    dateRange: "all",
    type: "all",
    method: "all",
    search: ""
  },

  render() {
    const container = document.getElementById("view-finance");
    if (!container) return;

    const kpis = window.store.getKPIs();
    const orders = window.store.state.orders;
    const expenses = window.store.state.expenses;
    const contracts = window.store.state.contracts;
    const auditData = window.store.getAuditTransactions(this.auditFilters);

    // تصفية الزيارات التي عليها متبقي مالي
    const debtOrders = orders.filter(o => o.remainingAmount > 0);

    // إجمالي المصروفات الكلية
    const totalAllExpenses = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    // إجمالي الإيرادات الكلية المحصلة
    const totalAllRevenue = orders.reduce((sum, o) => sum + (Number(o.paidAmount) || 0), 0);

    container.innerHTML = `
      <!-- بطاقات الإحصائيات المالية المباشرة -->
      <div class="kpi-grid">
        <div class="kpi-card" style="--kpi-color: #10b981; --kpi-bg: #d1fae5;">
          <div class="kpi-icon-box" style="color:#059669; background-color:#d1fae5;">
            <i data-lucide="arrow-down-left"></i>
          </div>
          <div class="kpi-data">
            <div class="kpi-label">مقبوضات اليوم المحصلة</div>
            <div class="kpi-value" style="color:#059669;">${kpis.todayRevenue.toLocaleString()} ج.م</div>
            <div class="kpi-sub">إجمالي كل المقبوضات: ${totalAllRevenue.toLocaleString()} ج.م</div>
          </div>
        </div>

        <div class="kpi-card" style="--kpi-color: #ef4444; --kpi-bg: #fee2e2;">
          <div class="kpi-icon-box" style="color:#dc2626; background-color:#fee2e2;">
            <i data-lucide="clock"></i>
          </div>
          <div class="kpi-data">
            <div class="kpi-label">المتبقي عند المرضى (مديونيات)</div>
            <div class="kpi-value" style="color:#dc2626;">${kpis.totalRemaining.toLocaleString()} ج.م</div>
            <div class="kpi-sub">${debtOrders.length} مرضى عليهم متبقي</div>
          </div>
        </div>

        <div class="kpi-card" style="--kpi-color: #f59e0b; --kpi-bg: #fef3c7;">
          <div class="kpi-icon-box" style="color:#d97706; background-color:#fef3c7;">
            <i data-lucide="receipt"></i>
          </div>
          <div class="kpi-data">
            <div class="kpi-label">مصروفات المعمل اليومية</div>
            <div class="kpi-value" style="color:#d97706;">${kpis.todayExpenses.toLocaleString()} ج.م</div>
            <div class="kpi-sub">إجمالي المصروفات: ${totalAllExpenses.toLocaleString()} ج.م</div>
          </div>
        </div>

        <div class="kpi-card" style="--kpi-color: #0284c7; --kpi-bg: #e0f2fe;">
          <div class="kpi-icon-box" style="color:#0284c7; background-color:#e0f2fe;">
            <i data-lucide="trending-up"></i>
          </div>
          <div class="kpi-data">
            <div class="kpi-label">صافي دخل اليوم</div>
            <div class="kpi-value" style="color:${kpis.netDailyIncome >= 0 ? '#0284c7' : '#dc2626'};">${kpis.netDailyIncome.toLocaleString()} ج.م</div>
            <div class="kpi-sub">المقبوضات - المصروفات</div>
          </div>

          <!-- تذييل كشف التدقيق المالي عند الطباعة -->
          <div class="audit-print-footer" style="display:none; margin-top:16px; border-top:1.5px solid #0284c7; padding-top:10px;">
            <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.75rem; color:#475569;">
              <div>توقيع أمين الخزينة: ...........................</div>
              <div>اعتماد مدير المختبر: <strong>أ.د أحمد المراغي</strong></div>
              <div>سند لتطوير البرمجيات | م/ محمد الدباح • 01501084747 © 2026</div>
            </div>
          </div>

          <!-- تذييل حفظ حقوق الملكية والطباعة للدفتر المالي -->
          <div style="margin-top:16px; padding:8px 14px; background:var(--bg-tertiary); border:1px solid var(--border-color); border-radius:var(--radius-md); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; font-size:0.75rem;">
            <div style="color:var(--text-primary); font-weight:700;">
              سند لتطوير البرمجيات | Sanad Digital 💻 — برمجة: م/ محمد الدباح (01501084747)
            </div>
            <div style="color:var(--text-muted); font-size:0.72rem;">
              دفتر الأستاذ والتدقيق المالي مشفر ومحمي برمجياً • جميع الحقوق محفوظة © 2026
            </div>
          </div>
        </div>
      </div>

      <!-- الحاوية الرئيسية مع الألسنة الفرعية -->
      <div class="card audit-card">
        <div class="card-header">
          <div class="card-title">
            <i data-lucide="landmark"></i>
            <span>إدارة الخزينة والتحصيلات والمصروفات والتدقيق المالي</span>
          </div>

          <!-- أزرار التبويب الفرعي -->
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <button id="tab-btn-debts" class="btn btn-sm ${this.activeSubTab === 'debts' ? 'btn-primary' : 'btn-outline'}">
              <i data-lucide="hand-coins"></i>
              <span>تحصيل متبقيات المرضى (${debtOrders.length})</span>
            </button>

            <button id="tab-btn-expenses" class="btn btn-sm ${this.activeSubTab === 'expenses' ? 'btn-primary' : 'btn-outline'}">
              <i data-lucide="receipt-text"></i>
              <span>مصروفات المعمل (${expenses.length})</span>
            </button>

            <button id="tab-btn-contracts" class="btn btn-sm ${this.activeSubTab === 'contracts' ? 'btn-primary' : 'btn-outline'}">
              <i data-lucide="briefcase"></i>
              <span>جهات التعاقد والتأمين (${contracts.length})</span>
            </button>

            <button id="tab-btn-audit" class="btn btn-sm ${this.activeSubTab === 'audit' ? 'btn-primary' : 'btn-outline'}" style="border-color:var(--primary); font-weight:700;">
              <i data-lucide="scale"></i>
              <span>الفحص والتدقيق المالي الشامل (${auditData.totalCount})</span>
            </button>
          </div>
        </div>

        <!-- 1. محتوى تحصيل متبقيات المرضى -->
        <div id="subtab-content-debts" style="display: ${this.activeSubTab === 'debts' ? 'block' : 'none'};">
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>كود العينة</th>
                  <th>اسم المريض</th>
                  <th>الهاتف</th>
                  <th>تاريخ الحجز</th>
                  <th>الصافي المطلوب</th>
                  <th>المسدد</th>
                  <th>المتبقي للتحصيل</th>
                  <th style="text-align:center;">إجراء السداد</th>
                </tr>
              </thead>
              <tbody>
                ${debtOrders.length === 0 ? `
                  <tr>
                    <td colspan="8" style="text-align:center; padding:35px; color:var(--success);">
                      <i data-lucide="check-circle" style="width:36px;height:36px; display:inline-block; margin-bottom:8px;"></i>
                      <div>لا توجد أي متبقيات أو مديونيات متأخرة على المرضى حالياً. كل الحسابات مسواة بالكامل!</div>
                    </td>
                  </tr>
                ` : debtOrders.map(order => {
                  const patient = window.store.getPatient(order.patientId) || { name: "غير محدد", phone: "-" };

                  return `
                    <tr>
                      <td><strong style="font-family:var(--font-mono); color:var(--primary);">${order.barcode}</strong></td>
                      <td><strong>${patient.name}</strong></td>
                      <td>${patient.phone || '-'}</td>
                      <td>${new Date(order.createdAt).toLocaleDateString('ar-EG')}</td>
                      <td><strong>${order.netAmount} ج.م</strong></td>
                      <td style="color:var(--success); font-weight:700;">${order.paidAmount} ج.م</td>
                      <td style="color:var(--danger); font-weight:900; font-size:1rem;">${order.remainingAmount} ج.م</td>
                      <td style="text-align:center;">
                        <button class="btn btn-primary btn-sm btn-pay-remaining" data-order-id="${order.id}" data-patient-name="${patient.name}" data-remaining="${order.remainingAmount}">
                          <i data-lucide="wallet" style="width:14px;height:14px;"></i>
                          <span>تحصيل دفعة</span>
                        </button>
                      </td>
                    </tr>
                  `;
                }).join("")}
              </tbody>
            </table>
          </div>
        </div>

        <!-- 2. محتوى مصروفات المعمل -->
        <div id="subtab-content-expenses" style="display: ${this.activeSubTab === 'expenses' ? 'block' : 'none'};">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <p style="font-size:0.88rem; color:var(--text-secondary); margin:0;">
              تسجيل تكاليف الكواشف، العبوات، الصيانة، والإيجار لحساب صافي الأرباح بدقة.
            </p>
            <button id="btn-add-expense-modal" class="btn btn-primary btn-sm">
              <i data-lucide="plus"></i>
              <span>تسجيل مصروف جديد</span>
            </button>
          </div>

          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>كود المصروف</th>
                  <th>بند المصروف / البيان</th>
                  <th>التصنيف</th>
                  <th>المبلغ (ج.م)</th>
                  <th>التاريخ</th>
                  <th>ملاحظات</th>
                  <th style="text-align:center;">إجراء</th>
                </tr>
              </thead>
              <tbody>
                ${expenses.length === 0 ? `
                  <tr>
                    <td colspan="7" style="text-align:center; padding:30px; color:var(--text-muted);">
                      لا توجد مصروفات مسجلة. اضغط على "تسجيل مصروف جديد" للبدء.
                    </td>
                  </tr>
                ` : expenses.map(exp => `
                  <tr>
                    <td><code>${exp.id}</code></td>
                    <td><strong>${exp.title}</strong></td>
                    <td><span class="badge badge-warning">${exp.category}</span></td>
                    <td style="font-weight:800; color:var(--danger);">${exp.amount} ج.م</td>
                    <td>${exp.date}</td>
                    <td style="color:var(--text-muted); font-size:0.85rem;">${exp.notes || '-'}</td>
                    <td style="text-align:center;">
                      <button class="action-icon-btn btn-delete-expense" data-id="${exp.id}" title="حذف" style="color:var(--danger); display:inline-flex; width:32px; height:32px;">
                        <i data-lucide="trash-2" style="width:15px;height:15px;"></i>
                      </button>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>

        <!-- 3. محتوى جهات التعاقد والتأمين -->
        <div id="subtab-content-contracts" style="display: ${this.activeSubTab === 'contracts' ? 'block' : 'none'};">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <p style="font-size:0.88rem; color:var(--text-secondary); margin:0;">
              إدارة نسب الخصومات والمطالبات لشركات التأمين والنقابات المهنية.
            </p>
            <button id="btn-add-contract-modal" class="btn btn-primary btn-sm">
              <i data-lucide="plus"></i>
              <span>إضافة جهة تعاقد جديدة</span>
            </button>
          </div>

          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>اسم جهة التعاقد</th>
                  <th>نسبة خصم المعمل</th>
                  <th>نسبة تحمل المريض</th>
                  <th>عدد الحالات المسجلة</th>
                  <th>إجمالي قيمة التحاليل</th>
                </tr>
              </thead>
              <tbody>
                ${contracts.map(cont => {
                  const contractPatients = window.store.state.patients.filter(p => p.contractId === cont.id);
                  const patientIds = contractPatients.map(p => p.id);
                  const contractOrders = orders.filter(o => patientIds.includes(o.patientId));
                  const totalVolume = contractOrders.reduce((sum, o) => sum + o.totalAmount, 0);

                  return `
                    <tr>
                      <td><strong style="font-size:0.95rem; color:var(--primary);">${cont.name}</strong></td>
                      <td><span class="badge badge-info">${cont.discountPercent}%</span></td>
                      <td><span class="badge badge-warning">${cont.patientSharePercent}%</span></td>
                      <td><strong>${contractOrders.length} زيارات</strong></td>
                      <td><strong style="color:var(--text-primary);">${totalVolume.toLocaleString()} ج.م</strong></td>
                    </tr>
                  `;
                }).join("")}
              </tbody>
            </table>
          </div>
        </div>

        <!-- 4. محتوى الفحص والتدقيق المالي الشامل (Audit Ledger) -->
        <div id="subtab-content-audit" style="display: ${this.activeSubTab === 'audit' ? 'block' : 'none'};">
          
          <!-- ترويسة كشف التدقيق المالي عند الطباعة الرسمية -->
          <div class="audit-print-header" style="display:none;">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2.5px solid #0284c7; padding-bottom:10px; margin-bottom:14px;">
              <div style="display:flex; align-items:center; gap:12px;">
                <div style="width:48px; height:48px; border-radius:6px; overflow:hidden; border:1px solid #cbd5e1; background:#fff;">
                  <img src="assets/serum-logo.jpg" alt="شعار معمل سيرم" style="width:100%; height:100%; object-fit:cover;" onerror="this.style.display='none';" />
                </div>
                <div>
                  <h2 style="margin:0; font-size:1.15rem; color:#0284c7; font-weight:800;">معمل سيرم للتحاليل الطبية</h2>
                  <p style="margin:2px 0 0; font-size:0.75rem; color:#475569;">دفتر الأستاذ العام والتدقيق المالي ومطابقة الخزينة</p>
                </div>
              </div>
              <div style="text-align:left; font-size:0.78rem; color:#1e293b; line-height:1.4;">
                <div style="font-weight:800; color:#0284c7; font-size:0.85rem;">كشف التدقيق المالي المعتمد</div>
                <div>تاريخ الطباعة: ${new Date().toLocaleString('ar-EG')}</div>
                <div>المستخرج: ${window.store.getCurrentUser().name}</div>
              </div>
            </div>
          </div>

          <!-- شريط أدوات الفحص والتصفية الحية -->
          <div class="audit-filter-bar">
            <div style="display:flex; align-items:center; gap:6px; flex:1; min-width:220px;">
              <i data-lucide="search" style="color:var(--text-muted); width:16px; height:16px;"></i>
              <input type="text" id="audit-filter-search" class="form-control" placeholder="بحث باسم المريض، كود العينة، أو البيان..." value="${this.auditFilters.search}" style="font-size:0.85rem; padding:6px 10px;" />
            </div>

            <div style="display:flex; align-items:center; gap:6px;">
              <span style="font-size:0.8rem; font-weight:700; color:var(--text-secondary); white-space:nowrap;">نطاق التاريخ:</span>
              <select id="audit-filter-date" class="form-control" style="font-size:0.82rem; padding:6px 10px; width:135px;">
                <option value="all" ${this.auditFilters.dateRange === 'all' ? 'selected' : ''}>كل الفترات</option>
                <option value="today" ${this.auditFilters.dateRange === 'today' ? 'selected' : ''}>اليوم فقط</option>
                <option value="yesterday" ${this.auditFilters.dateRange === 'yesterday' ? 'selected' : ''}>أمس</option>
                <option value="week" ${this.auditFilters.dateRange === 'week' ? 'selected' : ''}>آخر 7 أيام</option>
                <option value="month" ${this.auditFilters.dateRange === 'month' ? 'selected' : ''}>الشهر الحالي</option>
              </select>
            </div>

            <div style="display:flex; align-items:center; gap:6px;">
              <span style="font-size:0.8rem; font-weight:700; color:var(--text-secondary); white-space:nowrap;">نوع الحركة:</span>
              <select id="audit-filter-type" class="form-control" style="font-size:0.82rem; padding:6px 10px; width:155px;">
                <option value="all" ${this.auditFilters.type === 'all' ? 'selected' : ''}>كل الحركات المالية</option>
                <option value="order_receipt" ${this.auditFilters.type === 'order_receipt' ? 'selected' : ''}>سندات قبض زيارات جديدة</option>
                <option value="debt_collection" ${this.auditFilters.type === 'debt_collection' ? 'selected' : ''}>تحصيل متبقيات مديونيات</option>
                <option value="expense" ${this.auditFilters.type === 'expense' ? 'selected' : ''}>سندات صرف مصروفات</option>
              </select>
            </div>

            <div style="display:flex; align-items:center; gap:6px;">
              <span style="font-size:0.8rem; font-weight:700; color:var(--text-secondary); white-space:nowrap;">وسيلة الدفع:</span>
              <select id="audit-filter-method" class="form-control" style="font-size:0.82rem; padding:6px 10px; width:125px;">
                <option value="all" ${this.auditFilters.method === 'all' ? 'selected' : ''}>كل الوسائل</option>
                <option value="cash" ${this.auditFilters.method === 'cash' ? 'selected' : ''}>نقدي (Cash)</option>
                <option value="card" ${this.auditFilters.method === 'card' ? 'selected' : ''}>بطاقة / فيزا</option>
                <option value="transfer" ${this.auditFilters.method === 'transfer' ? 'selected' : ''}>تحويل بنكي / محفظة</option>
              </select>
            </div>

            <div style="display:flex; gap:6px;">
              <button id="btn-reset-audit-filters" class="btn btn-outline btn-sm" title="إعادة ضبط الفلاتر">
                <i data-lucide="rotate-ccw" style="width:14px; height:14px;"></i>
                <span>تصفير</span>
              </button>
              <button id="btn-print-audit-report" class="btn btn-primary btn-sm" title="طباعة كشف التدقيق المالي">
                <i data-lucide="printer" style="width:14px; height:14px;"></i>
                <span>طباعة الكشف</span>
              </button>
            </div>
          </div>

          <!-- شريط مؤشرات الفحص والتدقيق المحتسبة لحظياً -->
          <div class="audit-metrics-bar">
            <div class="audit-metric-card" style="border-right:4px solid #10b981;">
              <div class="audit-metric-label">إجمالي المقبوضات المفحوصة (وارد للخزينة +)</div>
              <div class="audit-metric-val" style="color:#059669;">+ ${auditData.totalInflow.toLocaleString()} ج.م</div>
            </div>

            <div class="audit-metric-card" style="border-right:4px solid #ef4444;">
              <div class="audit-metric-label">إجمالي المصروفات المفحوصة (صادر من الخزينة -)</div>
              <div class="audit-metric-val" style="color:#dc2626;">- ${auditData.totalOutflow.toLocaleString()} ج.م</div>
            </div>

            <div class="audit-metric-card" style="border-right:4px solid #0284c7;">
              <div class="audit-metric-label">صافي النقدية / رصيد الخزينة المطابق</div>
              <div class="audit-metric-val" style="color:${auditData.netCash >= 0 ? '#0284c7' : '#dc2626'};">${auditData.netCash.toLocaleString()} ج.م</div>
            </div>

            <div class="audit-metric-card" style="border-right:4px solid #8b5cf6;">
              <div class="audit-metric-label">عدد القيود والحركات المسجلة المطابقة</div>
              <div class="audit-metric-val" style="color:#7c3aed;">${auditData.totalCount} قيد مدقق</div>
            </div>
          </div>

          <!-- جدول دفتر اليومية والتدقيق المالي الشامل -->
          <div class="table-responsive">
            <table class="data-table" id="audit-table-print">
              <thead>
                <tr>
                  <th>رقم القيد / الحركة</th>
                  <th>التاريخ والوقت</th>
                  <th>نوع الحركة</th>
                  <th>الطرف / الحساب والبيان</th>
                  <th>وسيلة الدفع</th>
                  <th style="color:#059669; font-weight:800;">وارد للخزينة (+)</th>
                  <th style="color:#dc2626; font-weight:800;">صادر (- )</th>
                  <th>منفذ الحركة</th>
                  <th style="text-align:center;">حالة المطابقة</th>
                </tr>
              </thead>
              <tbody>
                ${auditData.transactions.length === 0 ? `
                  <tr>
                    <td colspan="9" style="text-align:center; padding:35px; color:var(--text-muted);">
                      لا توجد أي حركات مالية مطابقة للفلاتر المحددة حالياً.
                    </td>
                  </tr>
                ` : auditData.transactions.map((tx) => {
                  const d = new Date(tx.date);
                  const dateStr = d.toLocaleDateString('ar-EG');
                  const timeStr = d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
                  
                  let badgeClass = "badge-info";
                  if (tx.type === "order_receipt") badgeClass = "badge-success";
                  if (tx.type === "debt_collection") badgeClass = "badge-info";
                  if (tx.type === "expense") badgeClass = "badge-danger";

                  return `
                    <tr>
                      <td><code style="font-size:0.8rem;">${tx.id}</code></td>
                      <td style="font-size:0.82rem; white-space:nowrap;">
                        <strong>${dateStr}</strong>
                        <div style="color:var(--text-muted); font-size:0.75rem;">${timeStr}</div>
                      </td>
                      <td><span class="badge ${badgeClass}" style="font-size:0.75rem;">${tx.typeLabel}</span></td>
                      <td>
                        <strong>${tx.party}</strong>
                        <div style="font-size:0.78rem; color:var(--text-muted);">${tx.details}</div>
                      </td>
                      <td>
                        <span style="font-size:0.8rem; display:inline-flex; align-items:center; gap:4px;">
                          <i data-lucide="${tx.paymentMethod === 'card' ? 'credit-card' : 'banknote'}" style="width:13px;height:13px; color:var(--primary);"></i>
                          ${tx.paymentMethod === 'card' ? 'فيزا / بطاقة' : (tx.paymentMethod === 'transfer' ? 'تحويل بنكي' : 'نقدي')}
                        </span>
                      </td>
                      <td style="color:#059669; font-weight:800; font-family:var(--font-mono); font-size:0.95rem;">
                        ${tx.direction === 'in' ? '+ ' + tx.amount.toLocaleString() + ' ج.م' : '-'}
                      </td>
                      <td style="color:#dc2626; font-weight:800; font-family:var(--font-mono); font-size:0.95rem;">
                        ${tx.direction === 'out' ? '- ' + tx.amount.toLocaleString() + ' ج.م' : '-'}
                      </td>
                      <td style="font-size:0.82rem;">${tx.by || 'مسؤول الخزينة'}</td>
                      <td style="text-align:center;">
                        <span class="badge badge-success" style="font-size:0.72rem; padding:3px 8px;">
                          ✓ معتمد ومطابق
                        </span>
                      </td>
                    </tr>
                  `;
                }).join("")}
              </tbody>
            </table>
          </div>

          <!-- تذييل كشف التدقيق المالي عند الطباعة -->
          <div class="audit-print-footer" style="display:none; margin-top:16px; border-top:1.5px solid #0284c7; padding-top:10px;">
            <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.75rem; color:#475569;">
              <div>توقيع أمين الخزينة: ...........................</div>
              <div>اعتماد مدير المختبر: <strong>أ.د أحمد المراغي</strong></div>
              <div>سند لتطوير البرمجيات | م/ محمد الدباح • 01501084747 © 2026</div>
            </div>
          </div>

          <!-- تذييل حفظ حقوق الملكية والطباعة للدفتر المالي -->
          <div style="margin-top:16px; padding:8px 14px; background:var(--bg-tertiary); border:1px solid var(--border-color); border-radius:var(--radius-md); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; font-size:0.75rem;">
            <div style="color:var(--text-primary); font-weight:700;">
              سند لتطوير البرمجيات | Sanad Digital 💻 — برمجة: م/ محمد الدباح (01501084747)
            </div>
            <div style="color:var(--text-muted); font-size:0.72rem;">
              دفتر الأستاذ والتدقيق المالي مشفر ومحمي برمجياً • جميع الحقوق محفوظة © 2026
            </div>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    this.initEventListeners();
  },

  initEventListeners() {
    const container = document.getElementById("view-finance");
    if (!container) return;

    // تبديل الألسنة الفرعية
    document.getElementById("tab-btn-debts").addEventListener("click", () => {
      this.activeSubTab = "debts";
      this.render();
    });

    document.getElementById("tab-btn-expenses").addEventListener("click", () => {
      this.activeSubTab = "expenses";
      this.render();
    });

    document.getElementById("tab-btn-contracts").addEventListener("click", () => {
      this.activeSubTab = "contracts";
      this.render();
    });

    const auditBtn = document.getElementById("tab-btn-audit");
    if (auditBtn) {
      auditBtn.addEventListener("click", () => {
        this.activeSubTab = "audit";
        this.render();
      });
    }

    // فلاتر التدقيق المالي
    const searchFilter = document.getElementById("audit-filter-search");
    if (searchFilter) {
      searchFilter.addEventListener("input", (e) => {
        this.auditFilters.search = e.target.value;
        this.render();
      });
    }

    const dateFilter = document.getElementById("audit-filter-date");
    if (dateFilter) {
      dateFilter.addEventListener("change", (e) => {
        this.auditFilters.dateRange = e.target.value;
        this.render();
      });
    }

    const typeFilter = document.getElementById("audit-filter-type");
    if (typeFilter) {
      typeFilter.addEventListener("change", (e) => {
        this.auditFilters.type = e.target.value;
        this.render();
      });
    }

    const methodFilter = document.getElementById("audit-filter-method");
    if (methodFilter) {
      methodFilter.addEventListener("change", (e) => {
        this.auditFilters.method = e.target.value;
        this.render();
      });
    }

    const resetFiltersBtn = document.getElementById("btn-reset-audit-filters");
    if (resetFiltersBtn) {
      resetFiltersBtn.addEventListener("click", () => {
        this.auditFilters = { dateRange: "all", type: "all", method: "all", search: "" };
        this.render();
      });
    }

    const printAuditBtn = document.getElementById("btn-print-audit-report");
    if (printAuditBtn) {
      printAuditBtn.addEventListener("click", () => {
        window.printDocument('audit');
      });
    }

    // تحصيل دفعة من المتبقي
    container.querySelectorAll(".btn-pay-remaining").forEach(btn => {
      btn.addEventListener("click", () => {
        const orderId = btn.getAttribute("data-order-id");
        const patientName = btn.getAttribute("data-patient-name");
        const remaining = parseFloat(btn.getAttribute("data-remaining"));

        this.showPaymentModal(orderId, patientName, remaining);
      });
    });

    // نافذة إضافة مصروف
    const addExpenseBtn = document.getElementById("btn-add-expense-modal");
    if (addExpenseBtn) {
      addExpenseBtn.addEventListener("click", () => this.showAddExpenseModal());
    }

    // حذف مصروف
    container.querySelectorAll(".btn-delete-expense").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        if (confirm("هل تريد بالتأكيد حذف هذا المصروف؟")) {
          window.store.deleteExpense(id);
          window.app.showToast("تم حذف المصروف بنجاح", "success");
          this.render();
        }
      });
    });

    // نافذة إضافة تعاقد
    const addContractBtn = document.getElementById("btn-add-contract-modal");
    if (addContractBtn) {
      addContractBtn.addEventListener("click", () => this.showAddContractModal());
    }
  },

  showPaymentModal(orderId, patientName, remaining) {
    const modalTitle = document.getElementById("modal-title");
    const modalBody = document.getElementById("modal-body");
    const modalFooter = document.getElementById("modal-footer");

    modalTitle.innerHTML = `<i data-lucide="coins" style="color:var(--success);"></i> تحصيل دفعة وتسوية مديونية مريض`;

    modalBody.innerHTML = `
      <div style="font-size:0.95rem; margin-bottom:16px;">
        <div>المريض: <strong>${patientName}</strong></div>
        <div style="margin-top:4px;">إجمالي المتبقي المستحق: <strong style="color:var(--danger); font-size:1.15rem;">${remaining} ج.م</strong></div>
      </div>

      <div class="form-group">
        <label class="form-label">المبلغ المسدد الآن (ج.م) *</label>
        <input type="number" id="pay-input-amount" class="form-control" value="${remaining}" min="1" max="${remaining}" style="font-size:1.1rem; font-weight:700;" />
      </div>

      <div class="form-group" style="margin-top:12px;">
        <label class="form-label">طريقة التحصيل *</label>
        <select id="pay-input-method" class="form-control">
          <option value="cash">نقداً في الخزينة (Cash)</option>
          <option value="card">بطاقة بنكية / فيزا (Card)</option>
          <option value="transfer">تحويل بنكي / محفظة إلكترونية</option>
        </select>
      </div>

      <div class="form-group" style="margin-top:12px;">
        <label class="form-label">ملاحظات التحصيل وسند القبض</label>
        <input type="text" id="pay-input-notes" class="form-control" placeholder="سداد دفعة من متبقي الحساب" />
      </div>
    `;

    modalFooter.innerHTML = `
      <button type="button" id="btn-confirm-payment" class="btn btn-success btn-sm">
        <i data-lucide="check"></i>
        <span>تأكيد استلام المبلغ بالخزينة</span>
      </button>
      <button type="button" id="btn-cancel-pay-modal" class="btn btn-outline btn-sm">إلغاء</button>
    `;

    if (window.lucide) window.lucide.createIcons();
    window.app.openModal();

    document.getElementById("btn-cancel-pay-modal").addEventListener("click", () => window.app.closeModal());

    document.getElementById("btn-confirm-payment").addEventListener("click", () => {
      const amt = parseFloat(document.getElementById("pay-input-amount").value);
      const method = document.getElementById("pay-input-method").value || "cash";
      const notes = document.getElementById("pay-input-notes").value || "";

      if (isNaN(amt) || amt <= 0) {
        window.app.showToast("يرجى إدخال مبلغ صحيح", "error");
        return;
      }

      window.store.payOrderRemaining(orderId, amt, method, notes);
      window.app.showToast(`تم تحصيل ${amt} ج.م وإضافتها إلى رصيد الخزينة بنجاح`, "success");
      window.app.closeModal();
      this.render();
    });
  },

  showAddExpenseModal() {
    const modalTitle = document.getElementById("modal-title");
    const modalBody = document.getElementById("modal-body");
    const modalFooter = document.getElementById("modal-footer");

    modalTitle.innerHTML = `<i data-lucide="plus-circle" style="color:var(--danger);"></i> تسجيل مصروف معملي جديد`;

    modalBody.innerHTML = `
      <form id="form-new-expense">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">بند المصروف / البيان *</label>
            <input type="text" id="new-exp-title" class="form-control" placeholder="مثال: شراء كواشف سكر ومستلزمات جل" required />
          </div>

          <div class="form-group">
            <label class="form-label">التصنيف *</label>
            <select id="new-exp-cat" class="form-control" required>
              <option value="كيماويات وكواشف">كيماويات وكواشف</option>
              <option value="مستلزمات سحب">مستلزمات سحب وأنابيب</option>
              <option value="رواتب وأجور">رواتب وأجور فنيين</option>
              <option value="إيجار ومرافق">إيجار ومرافق وكهرباء</option>
              <option value="صيانة أجهزة ومعايرة">صيانة أجهزة ومعايرة</option>
              <option value="نثريات وضيافة">نثريات وضيافة</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">المبلغ (ج.م) *</label>
            <input type="number" id="new-exp-amount" class="form-control" min="1" placeholder="مثال: 450" required />
          </div>

          <div class="form-group">
            <label class="form-label">التاريخ *</label>
            <input type="date" id="new-exp-date" class="form-control" value="${new Date().toISOString().split("T")[0]}" required />
          </div>
        </div>

        <div class="form-group" style="margin-top:10px;">
          <label class="form-label">ملاحظات إضافية / المورد</label>
          <input type="text" id="new-exp-notes" class="form-control" placeholder="اسم الشركة الموردة أو تفاصيل الفاتورة" />
        </div>
      </form>
    `;

    modalFooter.innerHTML = `
      <button type="button" id="btn-save-expense" class="btn btn-primary btn-sm">
        <i data-lucide="check"></i>
        <span>تسجيل المصروف</span>
      </button>
      <button type="button" id="btn-cancel-exp-modal" class="btn btn-outline btn-sm">إلغاء</button>
    `;

    if (window.lucide) window.lucide.createIcons();
    window.app.openModal();

    document.getElementById("btn-cancel-exp-modal").addEventListener("click", () => window.app.closeModal());

    document.getElementById("btn-save-expense").addEventListener("click", () => {
      const title = document.getElementById("new-exp-title").value;
      const category = document.getElementById("new-exp-cat").value;
      const amount = document.getElementById("new-exp-amount").value;
      const date = document.getElementById("new-exp-date").value;
      const notes = document.getElementById("new-exp-notes").value;

      if (!title || !amount) {
        window.app.showToast("يرجى ملء بند المصروف والمبلغ", "error");
        return;
      }

      window.store.addExpense({ title, category, amount, date, notes });
      window.app.showToast("تم تسجيل المصروف بنجاح", "success");
      window.app.closeModal();
      this.activeSubTab = "expenses";
      this.render();
    });
  },

  showAddContractModal() {
    const modalTitle = document.getElementById("modal-title");
    const modalBody = document.getElementById("modal-body");
    const modalFooter = document.getElementById("modal-footer");

    modalTitle.innerHTML = `<i data-lucide="briefcase" style="color:var(--primary);"></i> إضافة جهة تعاقد / تأمين جديدة`;

    modalBody.innerHTML = `
      <form id="form-new-contract">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">اسم جهة التعاقد / الشركة *</label>
            <input type="text" id="new-cont-name" class="form-control" placeholder="مثال: نقابة المعلمين، شركة بوبا للتأمين" required />
          </div>

          <div class="form-group">
            <label class="form-label">نسبة خصم المعمل (%) *</label>
            <input type="number" id="new-cont-disc" class="form-control" min="0" max="100" placeholder="مثال: 20" required />
          </div>

          <div class="form-group">
            <label class="form-label">نسبة تحمل المريض (%)</label>
            <input type="number" id="new-cont-share" class="form-control" min="0" max="100" placeholder="مثال: 10" />
          </div>
        </div>
      </form>
    `;

    modalFooter.innerHTML = `
      <button type="button" id="btn-save-contract" class="btn btn-primary btn-sm">
        <i data-lucide="check"></i>
        <span>إضافة التعاقد</span>
      </button>
      <button type="button" id="btn-cancel-cont-modal" class="btn btn-outline btn-sm">إلغاء</button>
    `;

    if (window.lucide) window.lucide.createIcons();
    window.app.openModal();

    document.getElementById("btn-cancel-cont-modal").addEventListener("click", () => window.app.closeModal());

    document.getElementById("btn-save-contract").addEventListener("click", () => {
      const name = document.getElementById("new-cont-name").value;
      const discountPercent = document.getElementById("new-cont-disc").value;
      const patientSharePercent = document.getElementById("new-cont-share").value;

      if (!name || discountPercent === "") {
        window.app.showToast("يرجى ملء اسم الجهة ونسبة الخصم", "error");
        return;
      }

      window.store.addContract({ name, discountPercent, patientSharePercent });
      window.app.showToast("تمت إضافة جهة التعاقد بنجاح", "success");
      window.app.closeModal();
      this.activeSubTab = "contracts";
      this.render();
    });
  }
};
