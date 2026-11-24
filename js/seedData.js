/**
 * نظام إدارة المختبرات الطبية - LabCore Pro
 * قاعدة البيانات الطبية الواقعية الشاملة والمطابقة لأنظمة المختبرات الحقيقية (Real LIS Database)
 */

window.SEED_DATA = {
  // الملف التعريفي الرسمي للمختبر
  labProfile: {
    nameAr: "مختبرات رويال لاب للتشخيص الطبي والباثولوجيا الإكلينيكية",
    nameEn: "Royal Diagnostic Laboratories & Clinical Pathology",
    licenseNo: "MOH-EG-2024-9142",
    directorName: "أ.د. شريف عبد الوهاب المراكبي",
    directorTitle: "أستاذ ورئيس قسم الباثولوجيا الإكلينيكية والطب المخبري - كلية الطب",
    phone: "01005544332 - 0227984411",
    address: "ميدان التحرير - برج الأطباء الدولي - الدور الخامس - القاهرة",
    email: "contact@royallab-eg.com",
    footerNotice: "النتائج معتمدة إلكترونياً ومطابقة لمعايير الجودة والأجهزة الآلية المرجعية (Sysmex, Roche Cobas, Beckman Coulter). يرجى مراجعة الطبيب المعالج للتقييم الإكلينيكي."
  },

  // 1. دليل التحاليل الطبية الشامل (أكثر من 50 تحليلاً معيارياً مقسمة حسب التخصصات المخبرية وألوان أنابيب السحب)
  tests: [
    // -------------------------------------------------------------
    // أمراض الدم والتجلط (Hematology & Coagulation)
    // -------------------------------------------------------------
    {
      id: "test-cbc",
      code: "CBC",
      nameAr: "صورة دم كاملة مع العد التفريقي (15 متغير)",
      nameEn: "Complete Blood Count & 5-Part Diff (CBC)",
      category: "أمراض الدم (Hematology)",
      tube: "EDTA (أنبوبة موف / كاب بنفسجي)",
      price: 180,
      parameters: [
        { key: "wbc", name: "White Blood Cells (WBCs)", unit: "10^3/uL", min: 4.0, max: 11.0, precision: 1 },
        { key: "rbc", name: "Red Blood Cells (RBCs)", unit: "10^6/uL", min: 4.5, max: 5.9, femaleMin: 4.0, femaleMax: 5.2, precision: 2 },
        { key: "hb", name: "Hemoglobin (Hb)", unit: "g/dL", min: 13.0, max: 17.5, femaleMin: 12.0, femaleMax: 15.5, precision: 1 },
        { key: "hct", name: "Hematocrit (HCT / PCV)", unit: "%", min: 40.0, max: 50.0, femaleMin: 36.0, femaleMax: 46.0, precision: 1 },
        { key: "mcv", name: "Mean Corpuscular Volume (MCV)", unit: "fL", min: 80.0, max: 98.0, precision: 1 },
        { key: "mch", name: "Mean Corpuscular Hb (MCH)", unit: "pg", min: 27.0, max: 33.0, precision: 1 },
        { key: "mchc", name: "MCHC", unit: "g/dL", min: 32.0, max: 36.0, precision: 1 },
        { key: "rdw", name: "RDW-CV (Red Cell Distribution)", unit: "%", min: 11.5, max: 14.5, precision: 1 },
        { key: "plt", name: "Platelet Count (PLT)", unit: "10^3/uL", min: 150, max: 450, precision: 0 },
        { key: "mpv", name: "Mean Platelet Volume (MPV)", unit: "fL", min: 7.5, max: 11.5, precision: 1 },
        { key: "neut", name: "Neutrophils %", unit: "%", min: 40, max: 75, precision: 0 },
        { key: "lymph", name: "Lymphocytes %", unit: "%", min: 20, max: 45, precision: 0 },
        { key: "mono", name: "Monocytes %", unit: "%", min: 2, max: 10, precision: 0 },
        { key: "eos", name: "Eosinophils %", unit: "%", min: 1, max: 6, precision: 0 },
        { key: "baso", name: "Basophils %", unit: "%", min: 0, max: 2, precision: 0 }
      ]
    },
    {
      id: "test-esr",
      code: "ESR",
      nameAr: "سرعة الترسيب (الساعة الأولى والثانية)",
      nameEn: "Erythrocyte Sedimentation Rate (ESR)",
      category: "أمراض الدم (Hematology)",
      tube: "Sodium Citrate (أنبوبة سوداء)",
      price: 70,
      parameters: [
        { key: "esr_1hr", name: "ESR (1st Hour)", unit: "mm/hr", min: 0, max: 15, femaleMin: 0, femaleMax: 20, precision: 0 },
        { key: "esr_2hr", name: "ESR (2nd Hour)", unit: "mm/hr", min: 0, max: 30, femaleMin: 0, femaleMax: 40, precision: 0 }
      ]
    },
    {
      id: "test-pt",
      code: "PT-INR",
      nameAr: "زمن ونسبة البروثرومبين ومعدل السيولة الدولي (PT / INR)",
      nameEn: "Prothrombin Time & INR",
      category: "أمراض الدم والتجلط (Coagulation)",
      tube: "Sodium Citrate (أنبوبة زرقاء)",
      price: 110,
      parameters: [
        { key: "pt_time", name: "Patient PT", unit: "Seconds", min: 11.0, max: 14.5, precision: 1 },
        { key: "pt_control", name: "Control PT", unit: "Seconds", min: 12.0, max: 12.5, precision: 1 },
        { key: "pt_conc", name: "Prothrombin Concentration", unit: "%", min: 70.0, max: 100.0, precision: 1 },
        { key: "inr", name: "INR (International Normalized Ratio)", unit: "Ratio", min: 0.9, max: 1.2, precision: 2 }
      ]
    },
    {
      id: "test-ptt",
      code: "PTT",
      nameAr: "زمن الثرومبوبلاستين الجزئي (سيولة الدم)",
      nameEn: "Partial Thromboplastin Time (aPTT)",
      category: "أمراض الدم والتجلط (Coagulation)",
      tube: "Sodium Citrate (أنبوبة زرقاء)",
      price: 110,
      parameters: [
        { key: "ptt_patient", name: "Patient aPTT", unit: "Seconds", min: 26.0, max: 38.0, precision: 1 },
        { key: "ptt_control", name: "Control aPTT", unit: "Seconds", min: 30.0, max: 32.0, precision: 1 }
      ]
    },
    {
      id: "test-blood-group",
      code: "ABO-RH",
      nameAr: "فصيلة الدم وعامل ريسس (ABO & Rh Group)",
      nameEn: "Blood Grouping & Rh Typing",
      category: "أمراض الدم (Hematology)",
      tube: "EDTA (أنبوبة موف)",
      price: 60,
      parameters: [
        { key: "abo", name: "ABO Blood Group", unit: "", precision: 0 },
        { key: "rh", name: "Rh Factor", unit: "", precision: 0 }
      ]
    },
    {
      id: "test-d-dimer",
      code: "D-DIMER",
      nameAr: "تحليل داي ديمر لتجلط الدم (D-Dimer Quantitative)",
      nameEn: "D-Dimer Quantitative Assay",
      category: "أمراض الدم والتجلط (Coagulation)",
      tube: "Sodium Citrate (أنبوبة زرقاء)",
      price: 280,
      parameters: [
        { key: "ddimer", name: "D-Dimer Level", unit: "ug/mL FEU", min: 0.0, max: 0.5, precision: 2 }
      ]
    },

    // -------------------------------------------------------------
    // كيمياء الدم ووظائف الكلى (Renal Function Tests)
    // -------------------------------------------------------------
    {
      id: "test-creat",
      code: "CREAT",
      nameAr: "كرياتينين مصل الدم",
      nameEn: "Serum Creatinine",
      category: "وظائف الكلى (Renal Function)",
      tube: "Serum Clot Activator (أنبوبة صفراء جل)",
      price: 80,
      parameters: [
        { key: "creat", name: "Creatinine", unit: "mg/dL", min: 0.6, max: 1.2, femaleMin: 0.5, femaleMax: 1.0, precision: 2 }
      ]
    },
    {
      id: "test-urea",
      code: "UREA",
      nameAr: "بولينا الدم (Blood Urea)",
      nameEn: "Blood Urea",
      category: "وظائف الكلى (Renal Function)",
      tube: "Serum Clot Activator (أنبوبة صفراء جل)",
      price: 80,
      parameters: [
        { key: "urea", name: "Blood Urea", unit: "mg/dL", min: 15, max: 45, precision: 0 }
      ]
    },
    {
      id: "test-uric",
      code: "UA",
      nameAr: "حمض اليوريك (النقرس)",
      nameEn: "Serum Uric Acid",
      category: "وظائف الكلى (Renal Function)",
      tube: "Serum Clot Activator (أنبوبة صفراء جل)",
      price: 75,
      parameters: [
        { key: "uric", name: "Uric Acid", unit: "mg/dL", min: 3.5, max: 7.2, femaleMin: 2.6, femaleMax: 6.0, precision: 1 }
      ]
    },

    // -------------------------------------------------------------
    // وظائف الكبد والإنزيمات (Liver Function Tests)
    // -------------------------------------------------------------
    {
      id: "test-alt",
      code: "ALT",
      nameAr: "إنزيم الكبد ALT / SGPT",
      nameEn: "Alanine Aminotransferase (ALT/SGPT)",
      category: "وظائف الكبد (Liver Function)",
      tube: "Serum Clot Activator (أنبوبة صفراء جل)",
      price: 85,
      parameters: [
        { key: "alt", name: "ALT (SGPT)", unit: "U/L", min: 0, max: 45, femaleMin: 0, femaleMax: 35, precision: 0 }
      ]
    },
    {
      id: "test-ast",
      code: "AST",
      nameAr: "إنزيم الكبد AST / SGOT",
      nameEn: "Aspartate Aminotransferase (AST/SGOT)",
      category: "وظائف الكبد (Liver Function)",
      tube: "Serum Clot Activator (أنبوبة صفراء جل)",
      price: 85,
      parameters: [
        { key: "ast", name: "AST (SGOT)", unit: "U/L", min: 0, max: 40, femaleMin: 0, femaleMax: 32, precision: 0 }
      ]
    },
    {
      id: "test-bili",
      code: "BIL-TOTAL-DIR",
      nameAr: "الصفراء الكلية والمباشرة وغير المباشرة",
      nameEn: "Total, Direct & Indirect Bilirubin",
      category: "وظائف الكبد (Liver Function)",
      tube: "Serum Clot Activator (أنبوبة صفراء جل)",
      price: 95,
      parameters: [
        { key: "bili_tot", name: "Total Bilirubin", unit: "mg/dL", min: 0.2, max: 1.2, precision: 2 },
        { key: "bili_dir", name: "Direct Bilirubin", unit: "mg/dL", min: 0.0, max: 0.3, precision: 2 },
        { key: "bili_ind", name: "Indirect Bilirubin", unit: "mg/dL", min: 0.1, max: 0.9, precision: 2 }
      ]
    },
    {
      id: "test-alp",
      code: "ALP",
      nameAr: "الفوسفاتاز القلوي (Alkaline Phosphatase)",
      nameEn: "Alkaline Phosphatase (ALP)",
      category: "وظائف الكبد (Liver Function)",
      tube: "Serum Clot Activator (أنبوبة صفراء جل)",
      price: 90,
      parameters: [
        { key: "alp", name: "Alkaline Phosphatase", unit: "U/L", min: 44, max: 147, precision: 0 }
      ]
    },
    {
      id: "test-albumin",
      code: "ALB-TP",
      nameAr: "البروتين الكلي والزلال ومعدل A/G",
      nameEn: "Total Protein & Serum Albumin Panel",
      category: "وظائف الكبد (Liver Function)",
      tube: "Serum Clot Activator (أنبوبة صفراء جل)",
      price: 100,
      parameters: [
        { key: "tp", name: "Total Protein", unit: "g/dL", min: 6.4, max: 8.3, precision: 1 },
        { key: "alb", name: "Serum Albumin", unit: "g/dL", min: 3.5, max: 5.0, precision: 1 },
        { key: "glob", name: "Globulin", unit: "g/dL", min: 2.3, max: 3.5, precision: 1 },
        { key: "ag_ratio", name: "A/G Ratio", unit: "Ratio", min: 1.1, max: 2.2, precision: 2 }
      ]
    },

    // -------------------------------------------------------------
    // السكري ومؤشرات التمثيل الغذائي (Diabetes & Metabolism)
    // -------------------------------------------------------------
    {
      id: "test-fbs",
      code: "FBS",
      nameAr: "سكر صائم في الدم (صيام 8 ساعات)",
      nameEn: "Fasting Blood Sugar (FBS)",
      category: "السكري والتمثيل الغذائي (Diabetes)",
      tube: "Sodium Fluoride (أنبوبة رمادية)",
      price: 60,
      parameters: [
        { key: "fbs", name: "Fasting Glucose", unit: "mg/dL", min: 70, max: 100, precision: 0 }
      ]
    },
    {
      id: "test-pp",
      code: "2H-PP",
      nameAr: "سكر بعد الأكل بساعتين",
      nameEn: "2-Hours Post-Prandial Blood Glucose",
      category: "السكري والتمثيل الغذائي (Diabetes)",
      tube: "Sodium Fluoride (أنبوبة رمادية)",
      price: 60,
      parameters: [
        { key: "pp_sugar", name: "2-Hours Post Prandial", unit: "mg/dL", min: 70, max: 140, precision: 0 }
      ]
    },
    {
      id: "test-hba1c",
      code: "HbA1c",
      nameAr: "السكر التراكمي ومعدل متوسط السكر (HbA1c & eAG)",
      nameEn: "Glycated Hemoglobin (HbA1c)",
      category: "السكري والتمثيل الغذائي (Diabetes)",
      tube: "EDTA (أنبوبة موف)",
      price: 160,
      parameters: [
        { key: "hba1c", name: "Hemoglobin A1c", unit: "%", min: 4.5, max: 5.6, precision: 1 },
        { key: "eag", name: "Estimated Average Glucose (eAG)", unit: "mg/dL", min: 83, max: 114, precision: 0 }
      ]
    },

    // -------------------------------------------------------------
    // ملف الدهون وصحة القلب (Lipid Profile Panel)
    // -------------------------------------------------------------
    {
      id: "test-lipid",
      code: "LIPID",
      nameAr: "ملف الدهون الكامل (الكولسترول، الدهون الثلاثية، النافع والضار)",
      nameEn: "Complete Lipid Profile Panel",
      category: "الدهون وصحة القلب (Lipids)",
      tube: "Serum Clot Activator (أنبوبة صفراء جل)",
      price: 240,
      parameters: [
        { key: "chol", name: "Total Cholesterol", unit: "mg/dL", min: 120, max: 200, precision: 0 },
        { key: "trig", name: "Triglycerides", unit: "mg/dL", min: 50, max: 150, precision: 0 },
        { key: "hdl", name: "HDL-Cholesterol (Good)", unit: "mg/dL", min: 40, max: 65, femaleMin: 50, femaleMax: 75, precision: 0 },
        { key: "ldl", name: "LDL-Cholesterol (Bad)", unit: "mg/dL", min: 60, max: 130, precision: 0 },
        { key: "vldl", name: "VLDL-Cholesterol", unit: "mg/dL", min: 10, max: 30, precision: 0 },
        { key: "chol_hdl", name: "Risk Ratio (Chol/HDL)", unit: "Ratio", min: 2.5, max: 4.5, precision: 1 }
      ]
    },

    // -------------------------------------------------------------
    // هرمونات الغدة الدرقية والغدد الصماء (Thyroid & Endocrinology)
    // -------------------------------------------------------------
    {
      id: "test-tsh",
      code: "TSH-ULTRA",
      nameAr: "هرمون الغدة الدرقية فائق الحساسية (TSH Ultrasensitive)",
      nameEn: "Thyroid Stimulating Hormone (TSH)",
      category: "الهرمونات والغدد (Endocrinology)",
      tube: "Serum Clot Activator (أنبوبة صفراء جل)",
      price: 150,
      parameters: [
        { key: "tsh", name: "TSH Ultrasensitive", unit: "uIU/mL", min: 0.35, max: 4.94, precision: 2 }
      ]
    },
    {
      id: "test-ft4",
      code: "FT4",
      nameAr: "هرمون الثيروكسين الحر (Free T4)",
      nameEn: "Free Thyroxine (FT4)",
      category: "الهرمونات والغدد (Endocrinology)",
      tube: "Serum Clot Activator (أنبوبة صفراء جل)",
      price: 150,
      parameters: [
        { key: "ft4", name: "Free T4", unit: "ng/dL", min: 0.93, max: 1.70, precision: 2 }
      ]
    },
    {
      id: "test-ft3",
      code: "FT3",
      nameAr: "هرمون التراي يودوثيرونين الحر (Free T3)",
      nameEn: "Free Triiodothyronine (FT3)",
      category: "الهرمونات والغدد (Endocrinology)",
      tube: "Serum Clot Activator (أنبوبة صفراء جل)",
      price: 150,
      parameters: [
        { key: "ft3", name: "Free T3", unit: "pg/mL", min: 2.0, max: 4.4, precision: 2 }
      ]
    },

    // -------------------------------------------------------------
    // الفيتامينات والمعادن ومخزون الحديد (Vitamins & Trace Elements)
    // -------------------------------------------------------------
    {
      id: "test-vitd",
      code: "VIT-D3",
      nameAr: "فيتامين د الكلي (25-OH Vitamin D Total)",
      nameEn: "25-Hydroxy Vitamin D Total",
      category: "الفيتامينات والمعادن (Vitamins)",
      tube: "Serum Clot Activator (أنبوبة صفراء جل)",
      price: 320,
      parameters: [
        { key: "vitd", name: "Vitamin D (25-OH)", unit: "ng/mL", min: 30.0, max: 100.0, precision: 1 }
      ]
    },
    {
      id: "test-ferritin",
      code: "FERRITIN",
      nameAr: "مخزون الحديد في الدم (Serum Ferritin)",
      nameEn: "Serum Ferritin Level",
      category: "الفيتامينات والمعادن (Vitamins)",
      tube: "Serum Clot Activator (أنبوبة صفراء جل)",
      price: 180,
      parameters: [
        { key: "ferritin", name: "Ferritin", unit: "ng/mL", min: 30, max: 400, femaleMin: 15, femaleMax: 200, precision: 1 }
      ]
    },
    {
      id: "test-calcium",
      code: "CA-TOTAL",
      nameAr: "الكالسيوم الكلي في الدم",
      nameEn: "Total Serum Calcium",
      category: "الأملاح والمعادن (Electrolytes)",
      tube: "Serum Clot Activator (أنبوبة صفراء جل)",
      price: 70,
      parameters: [
        { key: "calcium", name: "Total Calcium", unit: "mg/dL", min: 8.5, max: 10.5, precision: 1 }
      ]
    },

    // -------------------------------------------------------------
    // المناعة والأملاح ودلالات الالتهاب (Immunology & Electrolytes)
    // -------------------------------------------------------------
    {
      id: "test-crp",
      code: "CRP-QUANT",
      nameAr: "بروتين سي التفاعلي كمي (CRP Quantitative)",
      nameEn: "C-Reactive Protein (Quantitative)",
      category: "المناعة والأمصال (Immunology)",
      tube: "Serum Clot Activator (أنبوبة صفراء جل)",
      price: 120,
      parameters: [
        { key: "crp", name: "CRP Quantitative", unit: "mg/L", min: 0.0, max: 6.0, precision: 1 }
      ]
    },
    {
      id: "test-electrolytes",
      code: "NA-K",
      nameAr: "أملاح الدم (الصوديوم والبوتاسيوم)",
      nameEn: "Serum Electrolytes (Na+ / K+)",
      category: "الأملاح والمعادن (Electrolytes)",
      tube: "Serum Clot Activator (أنبوبة صفراء جل)",
      price: 140,
      parameters: [
        { key: "na", name: "Sodium (Na+)", unit: "mEq/L", min: 135, max: 148, precision: 0 },
        { key: "k", name: "Potassium (K+)", unit: "mEq/L", min: 3.5, max: 5.1, precision: 1 }
      ]
    },

    // -------------------------------------------------------------
    // الفحص الميكروسكوبي للبول (Complete Urinalysis)
    // -------------------------------------------------------------
    {
      id: "test-urine",
      code: "URINE",
      nameAr: "تحليل البول الكامل الميكروسكوبي والكيميائي",
      nameEn: "Complete Urinalysis (Physical, Chemical & Microscopic)",
      category: "الفحص الميكروسكوبي (Clinical Microscopy)",
      tube: "Sterile Urine Cup (كوب بول معقم)",
      price: 60,
      parameters: [
        { key: "u_color", name: "Color (اللون)", unit: "", precision: 0 },
        { key: "u_aspect", name: "Aspect (المظهر والشفافية)", unit: "", precision: 0 },
        { key: "u_sg", name: "Specific Gravity (الكثافة النوعية)", unit: "", min: 1.015, max: 1.025, precision: 3 },
        { key: "u_ph", name: "Reaction (pH)", unit: "", min: 5.0, max: 7.5, precision: 1 },
        { key: "u_alb", name: "Protein / Albumin", unit: "", precision: 0 },
        { key: "u_sug", name: "Sugar / Glucose", unit: "", precision: 0 },
        { key: "u_pus", name: "Pus Cells (خلايا الصديد)", unit: "/HPF", min: 0, max: 5, precision: 0 },
        { key: "u_rbc", name: "RBCs (كرات الدم الحمراء)", unit: "/HPF", min: 0, max: 3, precision: 0 },
        { key: "u_cryst", name: "Crystals (الأملاح والبلورات)", unit: "", precision: 0 }
      ]
    }
  ],

  // 2. باقات الفحص الشاملة الحقيقية المعتمدة في المختبرات
  packages: [
    {
      id: "pkg-full-executive",
      nameAr: "باقة الفحص الشامل التنفيذي VIP",
      nameEn: "Executive Comprehensive Health Checkup",
      description: "صورة دم كاملة + سكر صائم وتراكمي + وظائف كلى + وظائف كبد + دهون كاملة + غدة درقية TSH + فيتامين د",
      testIds: ["test-cbc", "test-fbs", "test-hba1c", "test-creat", "test-urea", "test-alt", "test-ast", "test-lipid", "test-tsh", "test-vitd"],
      price: 980,
      active: true
    },
    {
      id: "pkg-diabetes-comprehensive",
      nameAr: "باقة رعاية ومتابعة مريض السكري المتقدمة",
      nameEn: "Advanced Diabetes Care & Nephropathy Screening",
      description: "سكر صائم + سكر بعد الأكل بساعتين + السكر التراكمي + كرياتينين وبولينا + ملف الدهون الكامل",
      testIds: ["test-fbs", "test-pp", "test-hba1c", "test-creat", "test-urea", "test-lipid"],
      price: 520,
      active: true
    },
    {
      id: "pkg-liver-kidney-panel",
      nameAr: "باقة وظائف الأعضاء الحيوية (الكبد والكلى)",
      nameEn: "Vital Hepatic & Renal Organ Function Panel",
      description: "كرياتينين + بولينا + حمض اليوريك + ALT + AST + الصفراء الكلية والمباشرة + بروتينات الكبد",
      testIds: ["test-creat", "test-urea", "test-uric", "test-alt", "test-ast", "test-bili", "test-albumin"],
      price: 490,
      active: true
    },
    {
      id: "pkg-anemia-fatigue",
      nameAr: "باقة الأنيميا وتساقط الشعر والإرهاق",
      nameEn: "Anemia, Fatigue & Hair Loss Panel",
      description: "صورة دم كاملة + مخزون الحديد (Serum Ferritin) + فيتامين د + هرمون الغدة الدرقية TSH",
      testIds: ["test-cbc", "test-ferritin", "test-vitd", "test-tsh"],
      price: 690,
      active: true
    },
    {
      id: "pkg-pre-marital",
      nameAr: "باقة الفحص الطبي للمقبلين على الزواج",
      nameEn: "Pre-Marital Health & Genetic Screening",
      description: "صورة دم كاملة + فصيلة الدم وعامل ريسس + سكر عشوائي + وظائف كبد وكلى",
      testIds: ["test-cbc", "test-blood-group", "test-fbs", "test-creat", "test-alt"],
      price: 360,
      active: true
    },
    {
      id: "pkg-pre-operative",
      nameAr: "باقة فحوصات ما قبل العمليات الجراحية",
      nameEn: "Pre-Operative Surgical Clearance Panel",
      description: "صورة دم كاملة + سيولة الدم PT-INR و aPTT + سكر صائم + وظائف كلى وكبد",
      testIds: ["test-cbc", "test-pt", "test-ptt", "test-fbs", "test-creat", "test-alt"],
      price: 540,
      active: true
    }
  ],

  // 3. جهات التعاقد والتأمين الطبي الكبرى (Insurance & Corporate Syndicates)
  contracts: [
    { id: "cont-eng", name: "نقابة المهندسين المصرية", discountPercent: 20, patientSharePercent: 20 },
    { id: "cont-doc", name: "نقابة الأطباء - اتحاد المهن الطبية", discountPercent: 25, patientSharePercent: 10 },
    { id: "cont-metlife", name: "شركة متلايف للتأمين الطبي (MetLife)", discountPercent: 18, patientSharePercent: 15 },
    { id: "cont-axa", name: "شركة أكسا للخدمات الطبية (AXA Egypt)", discountPercent: 15, patientSharePercent: 10 },
    { id: "cont-petro", name: "قطاع البترول والغاز الطبيعي", discountPercent: 20, patientSharePercent: 0 }
  ],

  // 4. سجل مرضى واقعي متنوع (Clinical Cohort Cases)
  patients: [
    {
      id: "PAT-1001",
      name: "محمود إبراهيم الدسوقي",
      age: 54,
      gender: "male",
      phone: "01002345678",
      doctor: "د. طارق العوضي (استشاري أمراض الباطنة والسكري)",
      contractId: "cont-eng",
      createdAt: "2026-11-24T08:30:00"
    },
    {
      id: "PAT-1002",
      name: "مروة عادل عبد العزيز",
      age: 32,
      gender: "female",
      phone: "01124567890",
      doctor: "د. ريهام عبد المنعم (استشاري الغدد الصماء والنساء)",
      contractId: "cont-metlife",
      createdAt: "2026-11-24T09:15:00"
    },
    {
      id: "PAT-1003",
      name: "حامد توفيق الصياد",
      age: 63,
      gender: "male",
      phone: "01287654321",
      doctor: "أ.د. عصام جودة (أستاذ أمراض القلب والقسطرة)",
      contractId: "cont-doc",
      createdAt: "2026-11-24T10:00:00"
    },
    {
      id: "PAT-1004",
      name: "ياسمين كمال الشناوي",
      age: 27,
      gender: "female",
      phone: "01098765432",
      doctor: "د. نجوى السيد (أخصائي الباطنة العامة)",
      contractId: null,
      createdAt: "2026-11-24T11:20:00"
    },
    {
      id: "PAT-1005",
      name: "خالد سعيد عبد الحليم",
      age: 48,
      gender: "male",
      phone: "01555667788",
      doctor: "د. أحمد زكي (استشاري جراحة الأوعية والجراحة العامة)",
      contractId: "cont-petro",
      createdAt: "2026-11-24T12:45:00"
    }
  ],

  // 5. طلبات تحاليل حقيقية مكتملة ومعتمدة وبيانات مخبرية إكلينيكية واقعية
  orders: [
    // مريض 1: متابعة سكري من النوع الثاني مع اعتلال دهون الكبد
    {
      id: "ORD-2026-1001",
      barcode: "261124-1001",
      patientId: "PAT-1001",
      testsRequested: ["test-fbs", "test-pp", "test-hba1c", "test-creat", "test-alt"],
      totalAmount: 445,
      discountAmount: 89, // 20% خصم نقابة المهندسين
      netAmount: 356,
      paidAmount: 356,
      remainingAmount: 0,
      paymentMethod: "cash",
      status: "validated",
      results: {
        "test-fbs": { fbs: 168 }, // مرتفع High
        "test-pp": { pp_sugar: 245 }, // مرتفع High
        "test-hba1c": { hba1c: 8.4, eag: 194 }, // مرتفع High
        "test-creat": { creat: 1.15 }, // طبيعي
        "test-alt": { alt: 58 } // مرتفع خفيف High (كبد دهني)
      },
      validatedAt: "2026-11-24T11:30:00",
      validatedBy: "أ.د. شريف عبد الوهاب المراكبي",
      doctorNotes: "المريض يعاني من عدم انضباط سكر الدم التراكمي (HbA1c: 8.4%)، يُوصى بضبط جرعة العلاج ومتابعة المجهود الرياضي والتغذية الإكلينيكية.",
      createdAt: "2026-11-24T08:30:00"
    },

    // مريض 2: أنيميا نقص الحديد ونقص فيتامين د مع تساقط شعر
    {
      id: "ORD-2026-1002",
      barcode: "261124-1002",
      patientId: "PAT-1002",
      testsRequested: ["test-cbc", "test-ferritin", "test-vitd", "test-tsh"],
      totalAmount: 830,
      discountAmount: 149.4, // 18% متلايف
      netAmount: 680.6,
      paidAmount: 500,
      remainingAmount: 180.6, // متبقي مستحق للتحصيل
      paymentMethod: "card",
      status: "validated",
      results: {
        "test-cbc": {
          wbc: 6.8,
          rbc: 3.85, // منخفض للأنثى Low
          hb: 9.8, // منخفض للأنثى Low (Microcytic Hypochromic Anemia)
          hct: 31.5, // منخفض Low
          mcv: 72.0, // منخفض Low
          mch: 23.5, // منخفض Low
          mchc: 30.5,
          rdw: 16.2, // مرتفع Anisocytosis
          plt: 380,
          mpv: 8.9,
          neut: 62,
          lymph: 31,
          mono: 5,
          eos: 2,
          baso: 0
        },
        "test-ferritin": { ferritin: 8.5 }, // منخفض جداً Low (Severely depleted iron stores)
        "test-vitd": { vitd: 14.2 }, // نقص حاد فيتامين د Deficiency
        "test-tsh": { tsh: 2.15 } // سليم طبيعي
      },
      validatedAt: "2026-11-24T12:15:00",
      validatedBy: "أ.د. شريف عبد الوهاب المراكبي",
      doctorNotes: "صورة الدم تدل على أنيميا نقص الحديد الحادة (Microcytic Hypochromic Anemia) مع نقص شديد في مخزون الفيريتين وفيتامين د. يُنصح بالعلاج التعويضي للحديد وفيتامين د3.",
      createdAt: "2026-11-24T09:15:00"
    },

    // مريض 3: مريض قلب ومتابعة دهون وسيولة الدم
    {
      id: "ORD-2026-1003",
      barcode: "261124-1003",
      patientId: "PAT-1003",
      testsRequested: ["test-lipid", "test-pt", "test-creat"],
      totalAmount: 430,
      discountAmount: 107.5, // 25% نقابة الأطباء
      netAmount: 322.5,
      paidAmount: 322.5,
      remainingAmount: 0,
      paymentMethod: "cash",
      status: "validated",
      results: {
        "test-lipid": {
          chol: 238, // مرتفع High
          trig: 215, // مرتفع High
          hdl: 38, // منخفض Low
          ldl: 157, // مرتفع High
          vldl: 43, // مرتفع High
          chol_hdl: 6.2 // مرتفع Risk Ratio
        },
        "test-pt": {
          pt_time: 22.5,
          pt_control: 12.0,
          pt_conc: 38.0,
          inr: 2.35 // في النطاق العلاجي المطلوب لمريض القلب (Target 2.0 - 3.0)
        },
        "test-creat": { creat: 1.05 }
      },
      validatedAt: "2026-11-24T13:00:00",
      validatedBy: "أ.د. شريف عبد الوهاب المراكبي",
      doctorNotes: "معدل السيولة INR (2.35) يقع في النطاق العلاجي المناسب لأدوية السيولة ومضادات التجلط. مع وجود ارتفاع في الكولسترول والدهون الثلاثية.",
      createdAt: "2026-11-24T10:00:00"
    },

    // مريض 4: قيد الفحص وإدخال النتائج في المعمل
    {
      id: "ORD-2026-1004",
      barcode: "261124-1004",
      patientId: "PAT-1004",
      testsRequested: ["test-cbc", "test-tsh", "test-esr"],
      totalAmount: 400,
      discountAmount: 0,
      netAmount: 400,
      paidAmount: 300,
      remainingAmount: 100, // متبقي
      paymentMethod: "cash",
      status: "pending",
      results: {},
      validatedAt: null,
      validatedBy: null,
      doctorNotes: "",
      createdAt: "2026-11-24T11:20:00"
    },

    // مريض 5: تحضير لجراحة (ما قبل العمليات)
    {
      id: "ORD-2026-1005",
      barcode: "261124-1005",
      patientId: "PAT-1005",
      testsRequested: ["test-cbc", "test-pt", "test-ptt", "test-creat", "test-fbs"],
      totalAmount: 540,
      discountAmount: 108, // 20% شركة البترول
      netAmount: 432,
      paidAmount: 432,
      remainingAmount: 0,
      paymentMethod: "transfer",
      status: "completed", // تم إدخال النتائج وفي انتظار توقيع مدير المعمل
      results: {
        "test-cbc": { wbc: 7.2, rbc: 4.9, hb: 14.8, hct: 44.0, plt: 260 },
        "test-pt": { pt_time: 12.2, pt_control: 12.0, pt_conc: 95.0, inr: 1.02 },
        "test-ptt": { ptt_patient: 31.0, ptt_control: 30.5 },
        "test-creat": { creat: 0.90 },
        "test-fbs": { fbs: 88 }
      },
      validatedAt: null,
      validatedBy: null,
      doctorNotes: "فحوصات السيولة وصورة الدم ووظائف الكلى طبيعية ومناسبة لإجراء الجراحة.",
      createdAt: "2026-11-24T12:45:00"
    }
  ],

  // 6. مصروفات المعمل الواقعية (كواشف أجهزة، مستلزمات سحب، صيانة ومعايرة)
  expenses: [
    {
      id: "EXP-2026-101",
      title: "شراء باك كواشف ومحاليل جهاز صورة الدم (Sysmex XN-L 3-Pack Lyse & Diluent)",
      category: "كيماويات وكواشف",
      amount: 3200,
      date: "2026-11-24",
      notes: "فاتورة رقم 8841 - شركة التجهيزات الطبية الحديثة"
    },
    {
      id: "EXP-2026-102",
      title: "أنابيب سحب عينات مفرغة BD Vacutainer (EDTA + Gel + Citrate - 500 أنبوبة)",
      category: "مستلزمات سحب",
      amount: 1450,
      date: "2026-11-24",
      notes: "توريد أنابيب ومحاقن معقمة لغرفة السحب"
    },
    {
      id: "EXP-2026-103",
      title: "عقد صيانة دورية ومعايرة جهاز كيمياء الدم الآلي (Roche Cobas c311)",
      category: "صيانة أجهزة ومعايرة",
      amount: 2500,
      date: "2026-11-23",
      notes: "شهادة المعايرة وضبط الجودة QC الدورية"
    },
    {
      id: "EXP-2026-104",
      title: "كواشف تحاليل الهرمونات وفيتامين د (Roche Elecsys Vit D & TSH Packs)",
      category: "كيماويات وكواشف",
      amount: 4800,
      date: "2026-11-22",
      notes: "كيتس هرمونات لـ 200 اختبار"
    }
  ],

  // 7. أدوار وصلاحيات فريق العمل (Staff Roles & Permissions)
  roles: [
    {
      id: "director",
      title: "مدير المختبر / الطبيب الاستشاري",
      color: "var(--primary)",
      permissions: ["dashboard", "reception", "catalog", "results", "validate_results", "medical-report", "finance", "settings", "staff"]
    },
    {
      id: "technician",
      title: "أخصائي تحاليل / فني معمل",
      color: "#059669",
      permissions: ["dashboard", "catalog", "results", "medical-report"]
    },
    {
      id: "receptionist",
      title: "مسؤول استقبال وخدمة عملاء",
      color: "#d97706",
      permissions: ["dashboard", "reception", "medical-report"]
    },
    {
      id: "accountant",
      title: "محاسب ومسؤول الخزينة",
      color: "#7c3aed",
      permissions: ["dashboard", "finance", "reception"]
    }
  ],

  // 8. أعضاء فريق العمل المسجلين
  staff: [
    {
      id: "STAFF-101",
      name: "أ.د. شريف عبد الوهاب المراكبي",
      username: "dr_sherif",
      password: "admin123",
      role: "director",
      phone: "01005544332",
      email: "dr.sherif@royallab-eg.com",
      status: "active",
      joinedDate: "2024-01-15"
    },
    {
      id: "STAFF-102",
      name: "د. كريم ممدوح النجار",
      username: "kareem_lab",
      password: "tech123",
      role: "technician",
      phone: "01145678901",
      email: "kareem.chem@royallab-eg.com",
      status: "active",
      joinedDate: "2024-03-01"
    },
    {
      id: "STAFF-103",
      name: "أ. دينا سامي محمود",
      username: "dina_reception",
      password: "recep123",
      role: "receptionist",
      phone: "01234567812",
      email: "dina.sami@royallab-eg.com",
      status: "active",
      joinedDate: "2024-05-10"
    },
    {
      id: "STAFF-104",
      name: "أ. طارق مصطفى العوضي",
      username: "tarek_finance",
      password: "acc123",
      role: "accountant",
      phone: "01098765432",
      email: "tarek.finance@royallab-eg.com",
      status: "active",
      joinedDate: "2024-06-20"
    }
  ],

  currentUserId: "STAFF-101"
};
