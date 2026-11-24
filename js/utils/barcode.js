/**
 * نظام إدارة المختبرات الطبية - LabCore Pro
 * مولد الباركود المعملي والأكواد الفريدة (Barcode & Sample ID Generator)
 */

window.LabBarcode = {
  /**
   * توليد كود مريض جديد بنمط PAT-XXXX
   */
  generatePatientId(existingPatients = []) {
    const nextNum = existingPatients.length + 1001;
    return `PAT-${nextNum}`;
  },

  /**
   * توليد رقم طلب/عينة تسلسلي وتاريخي
   */
  generateOrderNumber(existingOrders = []) {
    const today = new Date();
    const yy = String(today.getFullYear()).slice(-2);
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const count = String(existingOrders.length + 1).padStart(4, '0');
    
    return {
      orderId: `ORD-${today.getFullYear()}-${count}`,
      barcode: `${yy}${mm}${dd}-${count}`
    };
  },

  /**
   * توليد رسم بياني SVG تفاعلي يحاكي شريط باركود حقيقي دقيق
   * @param {string} code - النص المراد تحويله لباركود
   * @param {number} width - عرض الرسم بالبكسل
   * @param {number} height - ارتفاع الخطوط
   */
  renderBarcodeSVG(code, width = 180, height = 45) {
    if (!code) return '';

    // توليد خطوط بصرية واقعية مشتقة من كود العينة
    let barsHTML = '';
    let currentX = 10;
    const barWidth1 = 2;
    const barWidth2 = 3.5;
    const barWidth3 = 1.5;

    // خط البداية القياسي
    barsHTML += `<rect x="${currentX}" y="0" width="2" height="${height}" fill="#0f172a" />`;
    currentX += 4;
    barsHTML += `<rect x="${currentX}" y="0" width="1.5" height="${height}" fill="#0f172a" />`;
    currentX += 5;

    // توليد الأشرطة بناءً على كود المحارف
    for (let i = 0; i < code.length; i++) {
      const charCode = code.charCodeAt(i);
      const w = (charCode % 3 === 0) ? barWidth2 : (charCode % 2 === 0 ? barWidth1 : barWidth3);
      const gap = (charCode % 4 === 0) ? 3 : 2;

      barsHTML += `<rect x="${currentX}" y="0" width="${w}" height="${height}" fill="#0f172a" />`;
      currentX += w + gap;
    }

    // خط النهاية القياسي
    barsHTML += `<rect x="${currentX}" y="0" width="2" height="${height}" fill="#0f172a" />`;
    currentX += 4;
    barsHTML += `<rect x="${currentX}" y="0" width="3" height="${height}" fill="#0f172a" />`;
    currentX += 8;

    const totalWidth = Math.max(width, currentX);

    return `
      <div class="barcode-container" style="display:inline-flex; flex-direction:column; align-items:center; background:#ffffff; padding:6px 12px; border:1px solid #cbd5e1; border-radius:4px;">
        <svg width="${totalWidth}" height="${height}" viewBox="0 0 ${totalWidth} ${height}" xmlns="http://www.w3.org/2000/svg" style="background:#ffffff;">
          ${barsHTML}
        </svg>
        <span style="font-family:'JetBrains Mono', monospace; font-size:12px; font-weight:700; color:#0f172a; margin-top:3px; letter-spacing:3px;">*${code}*</span>
      </div>
    `;
  }
};
