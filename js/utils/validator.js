/**
 * نظام إدارة المختبرات الطبية - LabCore Pro
 * محرك تقييم النتائج الطبية ومقارنتها بالمعدل الطبيعي (Clinical Validator)
 */

window.LabValidator = {
  /**
   * تقييم القيمة الرقمية مقارنة بالحد الأدنى والأقصى
   * @param {number|string} val - القيمة المدخلة
   * @param {number} min - الحد الأدنى الطبيعي
   * @param {number} max - الحد الأقصى الطبيعي
   * @returns {Object} كائن يحتوي على حالة النتيجة والعلامة والنص واللون
   */
  evaluate(val, min, max) {
    if (val === undefined || val === null || val === "") {
      return {
        status: "EMPTY",
        label: "-",
        cssClass: "",
        printClass: "",
        isAbnormal: false
      };
    }

    const num = parseFloat(val);
    if (isNaN(num)) {
      return {
        status: "TEXT",
        label: val,
        cssClass: "flag-normal",
        printClass: "print-flag-normal",
        isAbnormal: false
      };
    }

    if (min !== undefined && min !== null && num < min) {
      return {
        status: "LOW",
        label: "منخفض ▼ (Low)",
        badgeText: "LOW",
        cssClass: "flag-low",
        printClass: "print-flag-low",
        isAbnormal: true,
        diff: num - min
      };
    }

    if (max !== undefined && max !== null && num > max) {
      return {
        status: "HIGH",
        label: "مرتفع ▲ (High)",
        badgeText: "HIGH",
        cssClass: "flag-high",
        printClass: "print-flag-high",
        isAbnormal: true,
        diff: num - max
      };
    }

    return {
      status: "NORMAL",
      label: "طبيعي ✓ (Normal)",
      badgeText: "NORMAL",
      cssClass: "flag-normal",
      printClass: "print-flag-normal",
      isAbnormal: false
    };
  },

  /**
   * استخراج المدى المرجعي المناسب بحسب جنس المريض
   */
  getParamRange(param, gender = 'male') {
    let min = param.min;
    let max = param.max;

    if (gender === 'female') {
      if (param.femaleMin !== undefined) min = param.femaleMin;
      if (param.femaleMax !== undefined) max = param.femaleMax;
    }

    return { min, max, unit: param.unit };
  },

  /**
   * تنسيق صيغة المدى الطبيعي للعرض والطباعة
   */
  formatRange(min, max, unit) {
    if (min !== undefined && max !== undefined) {
      return `${min} - ${max} ${unit || ''}`.trim();
    } else if (max !== undefined) {
      return `< ${max} ${unit || ''}`.trim();
    } else if (min !== undefined) {
      return `> ${min} ${unit || ''}`.trim();
    }
    return "حسب المعيار";
  }
};
