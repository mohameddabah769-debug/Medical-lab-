/**
 * نظام إدارة المختبرات الطبية - LabCore Pro
 * موديول لوحة التحكم والمؤشرات الحية والتقارير التحليلية وساعات الذروة (Dashboard Component)
 */

window.DashboardComponent = {
  activePeriodTab: "daily", // 'daily' | 'weekly' | 'monthly' | 'yearly' | 'peak'

  render() {
    const container = document.getElementById("view-dashboard");
    if (!container) return;

    const kpis = window.store.getKPIs();
    const orders = window.store.state.orders;

    // جلب بيانات الفترة التحليلية المحددة أو ساعات الذروة
    const isPeak = this.activePeriodTab === "peak";
    const periodData = !isPeak ? window.store.getPeriodicAnalytics(this.activePeriodTab) : null;
    const peakData = isPeak ? window.store.getPeakHoursAnalytics() : null;

    container.innerHTML = `
      <!-- شبكة المؤشرات الحيوية اليومية الفورية -->
      <div class="kpi-grid">
        <div class="kpi-card" style="--kpi-color: var(--primary); --kpi-bg: var(--primary-light);">
          <div class="kpi-icon-box">
            <i data-lucide="users"></i>
          </div>
          <div class="kpi-data">
            <div class="kpi-label">مرضى وزيارات اليوم</div>
            <div class="kpi-value">${kpis.todayPatientsCount}</div>
            <div class="kpi-sub">إجمالي الحالات المسجلة: ${kpis.allOrdersCount}</div>
          </div>
        </div>

        <div class="kpi-card" style="--kpi-color: var(--warning); --kpi-bg: var(--warning-light);">
          <div class="kpi-icon-box" style="color:var(--warning-text); background-color:var(--warning-light);">
            <i data-lucide="clock"></i>
          </div>
          <div class="kpi-data">
            <div class="kpi-label">تحاليل قيد التنفيذ</div>
            <div class="kpi-value" style="color:var(--warning);">${kpis.pendingTests}</div>
            <div class="kpi-sub">في انتظار إدخال النتائج</div>
          </div>
        </div>

        <div class="kpi-card" style="--kpi-color: var(--success); --kpi-bg: var(--success-light);">
          <div class="kpi-icon-box" style="color:var(--success-text); background-color:var(--success-light);">
            <i data-lucide="check-circle-2"></i>
          </div>
          <div class="kpi-data">
            <div class="kpi-label">تحاليل جاهزة ومعتمدة</div>
            <div class="kpi-value" style="color:var(--success);">${kpis.readyTests}</div>
            <div class="kpi-sub">جاهزة للطباعة والتسليم</div>
          </div>
        </div>

        <div class="kpi-card" style="--kpi-color: #059669; --kpi-bg: #ecfdf5;">
          <div class="kpi-icon-box" style="color:#059669; background-color:#d1fae5;">
            <i data-lucide="coins"></i>
          </div>
          <div class="kpi-data">
            <div class="kpi-label">مقبوضات اليوم النقدية</div>
            <div class="kpi-value">${kpis.todayRevenue.toLocaleString()} ج.م</div>
            <div class="kpi-sub">المصروفات اليومية: ${kpis.todayExpenses.toLocaleString()} ج.م</div>
          </div>
        </div>

        <div class="kpi-card" style="--kpi-color: var(--danger); --kpi-bg: var(--danger-light);">
          <div class="kpi-icon-box" style="color:var(--danger-text); background-color:var(--danger-light);">
            <i data-lucide="alert-circle"></i>
          </div>
          <div class="kpi-data">
            <div class="kpi-label">متبقي طرف المرضى</div>
            <div class="kpi-value" style="color:var(--danger);">${kpis.totalRemaining.toLocaleString()} ج.م</div>
            <div class="kpi-sub">مديونيات مستحقة التحصيل</div>
          </div>
        </div>
      </div>

      <!-- مركز التقارير الدورية وساعات الذروة (Analytics & Peak Hours Suite) -->
      <div class="card" style="border:1.5px solid var(--border-color); box-shadow:var(--shadow-md);">
        <div class="card-header" style="flex-wrap:wrap; gap:12px;">
          <div class="card-title">
            <i data-lucide="bar-chart-3" style="color:var(--primary);"></i>
            <span>مركز التقارير التحليلية وساعات الذروة</span>
          </div>

          <!-- أزرار التبويب الزمني -->
          <div class="analytics-period-selector">
            <button class="btn btn-sm ${this.activePeriodTab === 'daily' ? 'btn-primary' : 'btn-outline'} btn-analytics-tab" data-period="daily">
              <i data-lucide="calendar"></i>
              <span>اليومي</span>
            </button>
            <button class="btn btn-sm ${this.activePeriodTab === 'weekly' ? 'btn-primary' : 'btn-outline'} btn-analytics-tab" data-period="weekly">
              <i data-lucide="calendar-days"></i>
              <span>الأسبوعي</span>
            </button>
            <button class="btn btn-sm ${this.activePeriodTab === 'monthly' ? 'btn-primary' : 'btn-outline'} btn-analytics-tab" data-period="monthly">
              <i data-lucide="calendar-range"></i>
              <span>الشهري</span>
            </button>
            <button class="btn btn-sm ${this.activePeriodTab === 'yearly' ? 'btn-primary' : 'btn-outline'} btn-analytics-tab" data-period="yearly">
              <i data-lucide="trending-up"></i>
              <span>السنوي</span>
            </button>
            <button class="btn btn-sm ${this.activePeriodTab === 'peak' ? 'btn-primary' : 'btn-outline'} btn-analytics-tab" data-period="peak" style="${this.activePeriodTab === 'peak' ? 'background:linear-gradient(135deg,#f97316,#ea580c); border-color:#f97316;' : 'color:#ea580c; border-color:rgba(234,88,12,0.4);'}">
              <i data-lucide="flame"></i>
              <span>ساعات الذروة 🔥</span>
            </button>
            <button id="btn-print-analytics" class="btn btn-outline btn-sm" title="طباعة التقرير التحليلي">
              <i data-lucide="printer"></i>
              <span>طباعة التقرير</span>
            </button>
          </div>
        </div>

        <!-- محتوى التقارير الدورية (يومي، أسبوعي، شهري، سنوي) -->
        ${!isPeak ? `
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
              <h4 style="margin:0; color:var(--text-primary); font-weight:800; font-size:1.05rem;">
                ${periodData.periodLabel}
              </h4>
              <span class="badge badge-info" style="font-size:0.8rem;">معدل اكتمال الفحوصات: ${periodData.completionRate}%</span>
            </div>

            <!-- بطاقات المؤشرات الدورية -->
            <div class="analytics-kpi-grid">
              <div class="analytics-card-stat" style="border-right:4px solid var(--primary);">
                <div class="analytics-card-stat-label">إجمالي الزيارات والحالات</div>
                <div class="analytics-card-stat-val" style="color:var(--primary);">${periodData.totalOrders} زيارة</div>
              </div>
              <div class="analytics-card-stat" style="border-right:4px solid #10b981;">
                <div class="analytics-card-stat-label">المقبوضات المحصلة (+)</div>
                <div class="analytics-card-stat-val" style="color:#059669;">${periodData.totalRevenue.toLocaleString()} ج.م</div>
              </div>
              <div class="analytics-card-stat" style="border-right:4px solid #ef4444;">
                <div class="analytics-card-stat-label">المصروفات المنصرفة (-)</div>
                <div class="analytics-card-stat-val" style="color:#dc2626;">${periodData.totalExpenses.toLocaleString()} ج.م</div>
              </div>
              <div class="analytics-card-stat" style="border-right:4px solid #0284c7;">
                <div class="analytics-card-stat-label">صافي الأرباح التشغيلية</div>
                <div class="analytics-card-stat-val" style="color:${periodData.netProfit >= 0 ? '#0284c7' : '#dc2626'};">${periodData.netProfit.toLocaleString()} ج.م</div>
              </div>
              <div class="analytics-card-stat" style="border-right:4px solid #8b5cf6;">
                <div class="analytics-card-stat-label">متوسط قيمة الزيارة</div>
                <div class="analytics-card-stat-val" style="color:#7c3aed;">${periodData.avgOrderValue.toLocaleString()} ج.م</div>
              </div>
            </div>

            <!-- مخطط الأعمدة التفصيلي للفترة -->
            <div style="margin-bottom:20px;">
              <div style="font-size:0.85rem; font-weight:800; color:var(--text-secondary); margin-bottom:10px; display:flex; align-items:center; gap:6px;">
                <i data-lucide="bar-chart-2" style="width:16px;height:16px;color:var(--primary);"></i>
                <span>التوزيع البياني للإيرادات والزيارات عبر الفترات:</span>
              </div>
              <div class="vertical-bar-chart-container">
                ${(() => {
                  const maxRev = Math.max(...periodData.breakdown.map(b => b.revenue), 1);
                  return periodData.breakdown.map(item => {
                    const heightPercent = Math.max(12, Math.round((item.revenue / maxRev) * 100));
                    return `
                      <div class="chart-column">
                        <div class="chart-bar-val">${item.revenue > 0 ? item.revenue.toLocaleString() : '-'}</div>
                        <div class="chart-bar-track">
                          <div class="chart-bar-fill" style="height:${heightPercent}%;"></div>
                        </div>
                        <div class="chart-hour-label" title="${item.label}">${item.label}</div>
                      </div>
                    `;
                  }).join("");
                })()}
              </div>
            </div>

            <!-- جدول أكثر التحاليل طلباً وإيراداً -->
            ${periodData.topTests && periodData.topTests.length > 0 ? `
              <div>
                <div style="font-size:0.88rem; font-weight:800; color:var(--text-secondary); margin-bottom:10px; display:flex; align-items:center; gap:6px;">
                  <i data-lucide="award" style="width:16px;height:16px;color:var(--warning);"></i>
                  <span>التحاليل الأكثر طلباً وإيراداً في هذه الفترة:</span>
                </div>
                <div class="table-responsive">
                  <table class="data-table" style="font-size:0.85rem;">
                    <thead>
                      <tr>
                        <th>الترتيب</th>
                        <th>كود الفحص</th>
                        <th>اسم التحليل</th>
                        <th>القسم المخبري</th>
                        <th>سعر الفحص</th>
                        <th>عدد مرات الطلب</th>
                        <th>إجمالي العائد المالي</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${periodData.topTests.map((t, idx) => `
                        <tr>
                          <td><strong>#${idx + 1}</strong></td>
                          <td><strong style="color:var(--primary); font-family:var(--font-mono);">${t.code}</strong></td>
                          <td><strong>${t.nameAr}</strong></td>
                          <td><span class="badge badge-info">${t.category}</span></td>
                          <td>${t.price} ج.م</td>
                          <td><span class="badge badge-success" style="font-size:0.8rem;">${t.count} حالات</span></td>
                          <td><strong style="color:#059669;">${t.totalVal.toLocaleString()} ج.م</strong></td>
                        </tr>
                      `).join("")}
                    </tbody>
                  </table>
                </div>
              </div>
            ` : ''}
          </div>
        ` : `
          <!-- محتوى تحليل ساعات الذروة والضغط المخبري -->
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
              <h4 style="margin:0; color:#ea580c; font-weight:800; font-size:1.1rem; display:flex; align-items:center; gap:8px;">
                <i data-lucide="flame"></i>
                <span>تحليل ساعات الذروة والضغط المخبري اليومي</span>
              </h4>
              <span class="badge" style="background:#fff7ed; color:#ea580c; border:1px solid #ea580c; font-weight:800; font-size:0.82rem;">
                أعلى ساعة ضغط: ${peakData.peakHourLabel}
              </span>
            </div>

            <!-- بطاقة التوصية الذكية لتوزيع فريق العمل -->
            <div class="peak-recommendation-box">
              <div style="width:40px; height:40px; border-radius:50%; background:#ffedd5; color:#ea580c; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                <i data-lucide="lightbulb" style="width:22px;height:22px;"></i>
              </div>
              <div style="font-size:0.88rem; line-height:1.5;">
                <strong style="color:#ea580c; display:block; margin-bottom:2px;">توصية توزيع الموارد وسرعة سحب العينات:</strong>
                <span>${peakData.recommendation}</span>
              </div>
            </div>

            <!-- بطاقات مؤشرات فترات الضغط -->
            <div class="analytics-kpi-grid">
              <div class="analytics-card-stat" style="border-right:4px solid #ea580c;">
                <div class="analytics-card-stat-label">ساعة الذروة القصوى (Peak Hour)</div>
                <div class="analytics-card-stat-val" style="color:#ea580c;">${peakData.peakHour.label}</div>
              </div>
              <div class="analytics-card-stat" style="border-right:4px solid var(--primary);">
                <div class="analytics-card-stat-label">الفترة التشغيلية الأكثر ازدحاماً</div>
                <div class="analytics-card-stat-val" style="color:var(--primary); font-size:1.05rem;">${peakData.busiestShift}</div>
              </div>
              <div class="analytics-card-stat" style="border-right:4px solid #10b981;">
                <div class="analytics-card-stat-label">إقبال الفترة الصباحية (8ص - 2م)</div>
                <div class="analytics-card-stat-val" style="color:#059669;">${peakData.morningShiftCount} عينة</div>
              </div>
              <div class="analytics-card-stat" style="border-right:4px solid #8b5cf6;">
                <div class="analytics-card-stat-label">إقبال الفترة المسائية (2م - 11م)</div>
                <div class="analytics-card-stat-val" style="color:#7c3aed;">${peakData.eveningShiftCount} عينة</div>
              </div>
            </div>

            <!-- مخطط الساعات الكامل من 8 صباحاً إلى 11 مساءً -->
            <div style="margin-bottom:20px;">
              <div style="font-size:0.85rem; font-weight:800; color:var(--text-secondary); margin-bottom:10px; display:flex; align-items:center; gap:6px;">
                <i data-lucide="clock-9" style="width:16px;height:16px;color:#ea580c;"></i>
                <span>مخطط تدفق المرضى وسحب العينات عبر ساعات التشغيل:</span>
              </div>
              <div class="vertical-bar-chart-container">
                ${peakData.hoursData.map(item => `
                  <div class="chart-column">
                    <div class="chart-bar-val" style="${item.isPeak ? 'color:#ea580c; font-weight:900;' : ''}">
                      ${item.count > 0 ? item.count : '-'}
                    </div>
                    <div class="chart-bar-track">
                      <div class="chart-bar-fill ${item.isPeak ? 'is-peak-bar' : ''}" style="height:${item.barHeight}%;"></div>
                    </div>
                    <div class="chart-hour-label ${item.isPeak ? 'is-peak-label' : ''}">
                      ${item.label}
                    </div>
                  </div>
                `).join("")}
              </div>
            </div>

            <!-- جدول تفصيلي بحركة الساعات -->
            <div class="table-responsive">
              <table class="data-table" style="font-size:0.85rem;">
                <thead>
                  <tr>
                    <th>ساعة العمل</th>
                    <th>التوقيت الكامل</th>
                    <th>عدد العينات والزيارات</th>
                    <th>إجمالي الإيراد المسجل</th>
                    <th>نسبة الضغط اليومي</th>
                    <th>مستوى الإقبال</th>
                  </tr>
                </thead>
                <tbody>
                  ${peakData.hoursData.map(item => `
                    <tr style="${item.isPeak ? 'background-color:rgba(249, 115, 22, 0.08); font-weight:700;' : ''}">
                      <td>
                        <strong>${item.label}</strong>
                        ${item.isPeak ? '<span class="badge" style="background:#ea580c; color:#fff; font-size:0.7rem; margin-right:6px;">ذروة 🔥</span>' : ''}
                      </td>
                      <td><code>${item.fullTime}</code></td>
                      <td><strong>${item.count} زيارة</strong></td>
                      <td style="color:#059669;">${item.revenue > 0 ? item.revenue.toLocaleString() + ' ج.م' : '-'}</td>
                      <td>
                        <div style="display:flex; align-items:center; gap:8px;">
                          <div style="flex:1; height:6px; background:var(--border-color); border-radius:3px; overflow:hidden;">
                            <div style="width:${item.percentage}%; height:100%; background:${item.isPeak ? '#ea580c' : 'var(--primary)'};"></div>
                          </div>
                          <span style="font-family:var(--font-mono); font-size:0.75rem;">${item.percentage}%</span>
                        </div>
                      </td>
                      <td>
                        <span class="badge ${item.isPeak ? 'badge-danger' : (item.count > 0 ? 'badge-info' : 'badge-outline')}" style="font-size:0.75rem;">
                          ${item.trafficLevel}
                        </span>
                      </td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>
        `}

        <!-- تذييل حفظ حقوق البرمجة والطباعة لمركز التقارير -->
        <div style="margin-top:22px; padding:10px 14px; background:var(--bg-tertiary); border:1px solid var(--border-color); border-radius:var(--radius-md); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; font-size:0.75rem;">
          <div style="display:flex; align-items:center; gap:8px;">
            <i data-lucide="shield-check" style="width:15px; height:15px; color:#10b981;"></i>
            <span style="font-weight:700; color:var(--text-primary);">سند لتطوير البرمجيات | Sanad Digital 💻</span>
            <span style="color:var(--text-muted);">— تم التطوير والبرمجة: <strong>م/ محمد الدباح</strong></span>
          </div>
          <div style="display:flex; align-items:center; gap:12px;">
            <a href="https://wa.me/201501084747" target="_blank" rel="noopener noreferrer" style="color:#10b981; font-weight:700; text-decoration:none; font-family:var(--font-mono);">
              01501084747 📲
            </a>
            <span style="color:var(--text-muted); font-size:0.72rem;">جميع حقوق الطبع والنشر والبرمجة محفوظة © 2026</span>
          </div>
        </div>
      </div>

      <!-- بطاقة الإجراءات السريعة وجدول أحدث الزيارات -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">
            <i data-lucide="activity"></i>
            <span>سجل زيارات وعينات اليوم</span>
          </div>
          <div style="display:flex; gap:10px;">
            <button id="dash-btn-new-order" class="btn btn-primary btn-sm">
              <i data-lucide="plus-circle"></i>
              <span>تسجيل زيارة جديدة</span>
            </button>
          </div>
        </div>

        <!-- جدول الزيارات -->
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>كود العينة / الباركود</th>
                <th>اسم المريض</th>
                <th>السن / النوع</th>
                <th>التحاليل المطلوبة</th>
                <th>الحساب (الصافي / المدفوع / المتبقي)</th>
                <th>الحالة المخبرية</th>
                <th style="text-align:center;">الإجراءات السريعة</th>
              </tr>
            </thead>
            <tbody>
              ${orders.length === 0 ? `
                <tr>
                  <td colspan="7" style="text-align:center; padding:30px; color:var(--text-muted);">
                    لا توجد زيارات مسجلة حتى الآن. اضغط على "تسجيل زيارة جديدة" للبدء.
                  </td>
                </tr>
              ` : orders.slice(0, 10).map(order => {
                const patient = window.store.getPatient(order.patientId) || { name: "غير محدد", age: "-", gender: "-" };
                
                const testNames = (order.testsRequested || []).map(tId => {
                  const t = window.store.state.tests.find(item => item.id === tId);
                  return t ? t.code : tId;
                }).join("، ");

                let statusBadge = '';
                if (order.status === 'validated') {
                  statusBadge = '<span class="badge badge-success"><i data-lucide="check-check" style="width:14px;height:14px;"></i> معتمد وجاهز</span>';
                } else if (order.status === 'completed') {
                  statusBadge = '<span class="badge badge-info"><i data-lucide="clock" style="width:14px;height:14px;"></i> بانتظار الاعتماد</span>';
                } else {
                  statusBadge = '<span class="badge badge-pending"><i data-lucide="flask-round" style="width:14px;height:14px;"></i> قيد الفحص</span>';
                }

                return `
                  <tr>
                    <td>
                      <div style="font-family:var(--font-mono); font-weight:700; color:var(--primary); font-size:0.95rem;">
                        ${order.barcode}
                      </div>
                      <small style="color:var(--text-muted); font-size:0.75rem;">${order.id}</small>
                    </td>
                    <td>
                      <strong style="font-size:0.95rem;">${patient.name}</strong>
                      <div style="font-size:0.78rem; color:var(--text-muted);">${patient.phone || 'بدون هاتف'}</div>
                    </td>
                    <td>${patient.age} سنة / ${patient.gender === 'male' ? 'ذكر' : 'أنثى'}</td>
                    <td>
                      <span title="${testNames}" style="max-width:200px; display:inline-block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                        ${testNames}
                      </span>
                    </td>
                    <td>
                      <div><strong>${order.netAmount} ج.م</strong></div>
                      <div style="font-size:0.78rem;">
                        <span style="color:var(--success);">مدفوع: ${order.paidAmount}</span>
                        ${order.remainingAmount > 0 ? `<span style="color:var(--danger); margin-right:6px; font-weight:700;">متبقي: ${order.remainingAmount}</span>` : ''}
                      </div>
                    </td>
                    <td>${statusBadge}</td>
                    <td style="text-align:center;">
                      <div style="display:inline-flex; gap:6px;">
                        <button class="btn btn-outline btn-sm action-enter-results" data-order-id="${order.id}" title="إدخال ومراجعة النتائج">
                          <i data-lucide="edit-3" style="width:14px;height:14px;"></i>
                          <span>النتائج</span>
                        </button>
                        <button class="btn btn-outline btn-sm action-view-receipt" data-order-id="${order.id}" title="عرض وطباعة إيصال الاستلام">
                          <i data-lucide="receipt" style="width:14px;height:14px;"></i>
                          <span>إيصال</span>
                        </button>
                        <button class="btn btn-outline btn-sm action-view-report" data-order-id="${order.id}" title="عرض وطباعة التقرير">
                          <i data-lucide="printer" style="width:14px;height:14px;"></i>
                          <span>تقرير</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // تفعيل الأيقونات
    if (window.lucide) {
      window.lucide.createIcons();
    }

    this.initEventListeners(container);
  },

  initEventListeners(container) {
    // أزرار التبويب الزمني
    container.querySelectorAll(".btn-analytics-tab").forEach(btn => {
      btn.addEventListener("click", () => {
        const period = btn.getAttribute("data-period");
        this.activePeriodTab = period;
        this.render();
      });
    });

    // زر طباعة التقرير التحليلي
    const printBtn = document.getElementById("btn-print-analytics");
    if (printBtn) {
      printBtn.addEventListener("click", () => {
        window.printDocument('analytics');
      });
    }

    // ربط الأحداث
    const newOrderBtn = document.getElementById("dash-btn-new-order");
    if (newOrderBtn) {
      newOrderBtn.addEventListener("click", () => {
        window.store.setView("reception");
      });
    }

    container.querySelectorAll(".action-enter-results").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const orderId = e.currentTarget.getAttribute("data-order-id");
        window.store.setView("results", orderId);
      });
    });

    container.querySelectorAll(".action-view-receipt").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const orderId = e.currentTarget.getAttribute("data-order-id");
        const order = window.store.getOrder(orderId);
        if (order && window.ReceptionComponent) {
          const patient = window.store.getPatient(order.patientId);
          window.ReceptionComponent.showReceiptModal(order, patient);
        }
      });
    });

    container.querySelectorAll(".action-view-report").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const orderId = e.currentTarget.getAttribute("data-order-id");
        window.store.setView("medical-report", orderId);
      });
    });
  }
};
