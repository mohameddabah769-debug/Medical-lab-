/**
 * نظام إدارة المختبرات الطبية - LabCore Pro
 * قاعدة البيانات الطبية الواقعية الشاملة والمطابقة لأنظمة المختبرات الحقيقية (Real LIS Database)
 */

window.SEED_DATA = {
  // بيانات حقوق الطبع والنشر والجهة المطورة
  developerInfo: {
    company: "سند لتطوير البرمجيات | Sanad Digital",
    developer: "م/ محمد الدباح",
    specialty: "حلول إدارة معامل التحاليل الطبية الذكية",
    phone: "01501084747",
    whatsapp: "https://wa.me/201501084747",
    copyright: "جميع الحقوق محفوظة © 2026"
  },

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
    {
        "id": "test-cbc",
        "code": "CBC",
        "nameAr": "صورة دم كاملة (CBC)",
        "nameEn": "Complete Blood Count & Diff",
        "category": "أمراض الدم (Hematology)",
        "tube": "EDTA (أنبوبة بنفسجي)",
        "price": 200,
        "parameters": [
            {
                "key": "wbc",
                "name": "White Blood Cells (WBCs)",
                "unit": "10^3/uL",
                "min": 4.0,
                "max": 11.0,
                "precision": 1
            },
            {
                "key": "rbc",
                "name": "Red Blood Cells (RBCs)",
                "unit": "10^6/uL",
                "min": 4.5,
                "max": 5.9,
                "femaleMin": 4.0,
                "femaleMax": 5.2,
                "precision": 2
            },
            {
                "key": "hb",
                "name": "Hemoglobin (Hb)",
                "unit": "g/dL",
                "min": 13.0,
                "max": 17.5,
                "femaleMin": 12.0,
                "femaleMax": 15.5,
                "precision": 1
            },
            {
                "key": "hct",
                "name": "Hematocrit (HCT / PCV)",
                "unit": "%",
                "min": 40.0,
                "max": 50.0,
                "femaleMin": 36.0,
                "femaleMax": 46.0,
                "precision": 1
            },
            {
                "key": "mcv",
                "name": "Mean Corpuscular Volume (MCV)",
                "unit": "fL",
                "min": 80.0,
                "max": 98.0,
                "precision": 1
            },
            {
                "key": "mch",
                "name": "Mean Corpuscular Hb (MCH)",
                "unit": "pg",
                "min": 27.0,
                "max": 33.0,
                "precision": 1
            },
            {
                "key": "mchc",
                "name": "MCHC",
                "unit": "g/dL",
                "min": 32.0,
                "max": 36.0,
                "precision": 1
            },
            {
                "key": "plt",
                "name": "Platelet Count (PLT)",
                "unit": "10^3/uL",
                "min": 150,
                "max": 450,
                "precision": 0
            }
        ]
    },
    {
        "id": "test-rbg",
        "code": "RBG",
        "nameAr": "سكر عشوائي في الدم (RBG)",
        "nameEn": "Random Blood Glucose",
        "category": "السكري والتمثيل الغذائي (Diabetes)",
        "tube": "Sodium Fluoride (أنبوبة رمادية)",
        "price": 50,
        "parameters": [
            {
                "key": "rbg",
                "name": "Random Glucose",
                "unit": "mg/dL",
                "min": 70,
                "max": 140,
                "precision": 0
            }
        ]
    },
    {
        "id": "test-fbs",
        "code": "FBS",
        "nameAr": "سكر صائم في الدم (FBS)",
        "nameEn": "Fasting Blood Sugar",
        "category": "السكري والتمثيل الغذائي (Diabetes)",
        "tube": "Sodium Fluoride (أنبوبة رمادية)",
        "price": 50,
        "parameters": [
            {
                "key": "fbs",
                "name": "Fasting Glucose",
                "unit": "mg/dL",
                "min": 70,
                "max": 100,
                "precision": 0
            }
        ]
    },
    {
        "id": "test-pp",
        "code": "2H-PP",
        "nameAr": "سكر بعد الأكل بساعتين (2H-PP)",
        "nameEn": "2-Hours Post-Prandial Glucose",
        "category": "السكري والتمثيل الغذائي (Diabetes)",
        "tube": "Sodium Fluoride (أنبوبة رمادية)",
        "price": 50,
        "parameters": [
            {
                "key": "pp_sugar",
                "name": "2-Hours Post Prandial",
                "unit": "mg/dL",
                "min": 70,
                "max": 140,
                "precision": 0
            }
        ]
    },
    {
        "id": "test-hba1c",
        "code": "HbA1c",
        "nameAr": "السكر التراكمي (HbA1c)",
        "nameEn": "Glycated Hemoglobin (HbA1c)",
        "category": "السكري والتمثيل الغذائي (Diabetes)",
        "tube": "EDTA (أنبوبة بنفسجي)",
        "price": 200,
        "parameters": [
            {
                "key": "hba1c",
                "name": "Hemoglobin A1c",
                "unit": "%",
                "min": 4.5,
                "max": 5.6,
                "precision": 1
            },
            {
                "key": "eag",
                "name": "Estimated Average Glucose (eAG)",
                "unit": "mg/dL",
                "min": 83,
                "max": 114,
                "precision": 0
            }
        ]
    },
    {
        "id": "test-urine",
        "code": "URINE",
        "nameAr": "تحليل البول الكامل (Urine Analysis)",
        "nameEn": "Complete Urine Analysis",
        "category": "المايكروبيولوجي والبول والبراز",
        "tube": "Urine Cup (كوب معقم)",
        "price": 50,
        "parameters": [
            {
                "key": "urine_pus",
                "name": "Pus Cells (WBCs)",
                "unit": "HPF",
                "min": 0,
                "max": 5,
                "precision": 0
            },
            {
                "key": "urine_rbc",
                "name": "Red Blood Cells (RBCs)",
                "unit": "HPF",
                "min": 0,
                "max": 3,
                "precision": 0
            },
            {
                "key": "urine_alb",
                "name": "Albumin / Protein",
                "unit": "Qual",
                "min": 0,
                "max": 0,
                "precision": 0
            },
            {
                "key": "urine_sug",
                "name": "Glucose / Sugar",
                "unit": "Qual",
                "min": 0,
                "max": 0,
                "precision": 0
            }
        ]
    },
    {
        "id": "test-stool",
        "code": "STOOL",
        "nameAr": "تحليل البراز الكامل (Stool Analysis)",
        "nameEn": "Complete Stool Analysis",
        "category": "المايكروبيولوجي والبول والبراز",
        "tube": "Stool Cup (كوب معقم)",
        "price": 50,
        "parameters": [
            {
                "key": "stool_pus",
                "name": "Pus Cells (WBCs)",
                "unit": "HPF",
                "min": 0,
                "max": 4,
                "precision": 0
            },
            {
                "key": "stool_rbc",
                "name": "RBCs",
                "unit": "HPF",
                "min": 0,
                "max": 2,
                "precision": 0
            },
            {
                "key": "stool_ova",
                "name": "Parasites / Ova",
                "unit": "Direct",
                "min": 0,
                "max": 0,
                "precision": 0
            }
        ]
    },
    {
        "id": "test-hpylori-stool",
        "code": "H.PYLORI-AG",
        "nameAr": "جرثومة المعدة في البراز (H.pylori Ag)",
        "nameEn": "H. pylori Antigen in Stool",
        "category": "المناعة والأمصال (Serology)",
        "tube": "Stool Cup (كوب معقم)",
        "price": 200,
        "parameters": [
            {
                "key": "hpylori_result",
                "name": "H. Pylori Antigen",
                "unit": "Qualitative",
                "min": 0,
                "max": 0,
                "precision": 0
            }
        ]
    },
    {
        "id": "test-bili",
        "code": "BIL-T",
        "nameAr": "الصفراء الكلية في الدم (Total Bilirubin)",
        "nameEn": "Total Serum Bilirubin",
        "category": "وظائف الكبد والإنزيمات (Hepatic)",
        "tube": "Serum Clot Activator (أنبوبة صفراء جل)",
        "price": 120,
        "parameters": [
            {
                "key": "bili_tot",
                "name": "Total Bilirubin",
                "unit": "mg/dL",
                "min": 0.2,
                "max": 1.2,
                "precision": 2
            },
            {
                "key": "bili_dir",
                "name": "Direct Bilirubin",
                "unit": "mg/dL",
                "min": 0.0,
                "max": 0.3,
                "precision": 2
            }
        ]
    },
    {
        "id": "test-pregnancy-qual",
        "code": "PREG-QUAL",
        "nameAr": "اختبار الحمل في الدم العادي (Pregnancy Qual)",
        "nameEn": "Pregnancy in Serum Qual",
        "category": "الهرمونات والغدد (Endocrinology)",
        "tube": "Serum Clot Activator (أنبوبة صفراء جل)",
        "price": 80,
        "parameters": [
            {
                "key": "preg_qual",
                "name": "Pregnancy Test",
                "unit": "Qualitative",
                "min": 0,
                "max": 0,
                "precision": 0
            }
        ]
    },
    {
        "id": "test-bhcg",
        "code": "BHCG",
        "nameAr": "هرمون الحمل الرقمي (Beta-HCG Quantitative)",
        "nameEn": "Quantitative Beta-hCG Pregnancy",
        "category": "الهرمونات والغدد (Endocrinology)",
        "tube": "Serum Clot Activator (أنبوبة صفراء جل)",
        "price": 200,
        "parameters": [
            {
                "key": "bhcg_val",
                "name": "Beta-hCG",
                "unit": "mIU/mL",
                "min": 0,
                "max": 5,
                "precision": 1
            }
        ]
    },
    {
        "id": "test-uric",
        "code": "URIC",
        "nameAr": "حمض البوليك / أملاح النقرس (Uric Acid)",
        "nameEn": "Serum Uric Acid",
        "category": "وظائف الكلى والأملاح (Renal)",
        "tube": "Serum Clot Activator (أنبوبة صفراء جل)",
        "price": 80,
        "parameters": [
            {
                "key": "uric_acid",
                "name": "Serum Uric Acid",
                "unit": "mg/dL",
                "min": 3.5,
                "max": 7.2,
                "femaleMin": 2.6,
                "femaleMax": 6.0,
                "precision": 1
            }
        ]
    },
    {
        "id": "test-creat",
        "code": "CREAT",
        "nameAr": "كرياتينين في الدم (Creatinine)",
        "nameEn": "Serum Creatinine",
        "category": "وظائف الكلى والأملاح (Renal)",
        "tube": "Serum Clot Activator (أنبوبة صفراء جل)",
        "price": 80,
        "parameters": [
            {
                "key": "creat",
                "name": "Creatinine",
                "unit": "mg/dL",
                "min": 0.7,
                "max": 1.3,
                "femaleMin": 0.5,
                "femaleMax": 1.1,
                "precision": 2
            }
        ]
    },
    {
        "id": "test-urea",
        "code": "UREA",
        "nameAr": "بولينا في الدم (Blood Urea)",
        "nameEn": "Blood Urea",
        "category": "وظائف الكلى والأملاح (Renal)",
        "tube": "Serum Clot Activator (أنبوبة صفراء جل)",
        "price": 80,
        "parameters": [
            {
                "key": "urea",
                "name": "Blood Urea",
                "unit": "mg/dL",
                "min": 15,
                "max": 45,
                "precision": 0
            }
        ]
    },
    {
        "id": "test-ast",
        "code": "AST",
        "nameAr": "إنزيم كبد AST (SGOT)",
        "nameEn": "Aspartate Aminotransferase (AST)",
        "category": "وظائف الكبد والإنزيمات (Hepatic)",
        "tube": "Serum Clot Activator (أنبوبة صفراء جل)",
        "price": 80,
        "parameters": [
            {
                "key": "ast",
                "name": "AST (SGOT)",
                "unit": "U/L",
                "min": 0,
                "max": 40,
                "precision": 0
            }
        ]
    },
    {
        "id": "test-alt",
        "code": "ALT",
        "nameAr": "إنزيم كبد ALT (SGPT)",
        "nameEn": "Alanine Aminotransferase (ALT)",
        "category": "وظائف الكبد والإنزيمات (Hepatic)",
        "tube": "Serum Clot Activator (أنبوبة صفراء جل)",
        "price": 80,
        "parameters": [
            {
                "key": "alt",
                "name": "ALT (SGPT)",
                "unit": "U/L",
                "min": 0,
                "max": 41,
                "precision": 0
            }
        ]
    },
    {
        "id": "test-albumin",
        "code": "ALB",
        "nameAr": "ألبومين في الدم (Serum Albumin)",
        "nameEn": "Serum Albumin",
        "category": "وظائف الكبد والإنزيمات (Hepatic)",
        "tube": "Serum Clot Activator (أنبوبة صفراء جل)",
        "price": 80,
        "parameters": [
            {
                "key": "albumin",
                "name": "Albumin",
                "unit": "g/dL",
                "min": 3.5,
                "max": 5.2,
                "precision": 1
            }
        ]
    },
    {
        "id": "test-protein",
        "code": "TP",
        "nameAr": "بروتين كلي في الدم (Total Protein)",
        "nameEn": "Total Serum Protein",
        "category": "وظائف الكبد والإنزيمات (Hepatic)",
        "tube": "Serum Clot Activator (أنبوبة صفراء جل)",
        "price": 80,
        "parameters": [
            {
                "key": "protein",
                "name": "Total Protein",
                "unit": "g/dL",
                "min": 6.4,
                "max": 8.3,
                "precision": 1
            }
        ]
    },
    {
        "id": "test-lipid",
        "code": "LIPID",
        "nameAr": "ملف الدهون الكامل والكولسترول (Lipid Profile)",
        "nameEn": "Complete Lipid Profile Panel",
        "category": "الدهون وصحة القلب (Lipids)",
        "tube": "Serum Clot Activator (أنبوبة صفراء جل)",
        "price": 280,
        "parameters": [
            {
                "key": "chol",
                "name": "Total Cholesterol",
                "unit": "mg/dL",
                "min": 120,
                "max": 200,
                "precision": 0
            },
            {
                "key": "trig",
                "name": "Triglycerides",
                "unit": "mg/dL",
                "min": 50,
                "max": 150,
                "precision": 0
            },
            {
                "key": "hdl",
                "name": "HDL-Cholesterol",
                "unit": "mg/dL",
                "min": 40,
                "max": 65,
                "precision": 0
            },
            {
                "key": "ldl",
                "name": "LDL-Cholesterol",
                "unit": "mg/dL",
                "min": 60,
                "max": 130,
                "precision": 0
            },
            {
                "key": "vldl",
                "name": "VLDL-Cholesterol",
                "unit": "mg/dL",
                "min": 10,
                "max": 30,
                "precision": 0
            }
        ]
    },
    {
        "id": "test-tsh",
        "code": "TSH",
        "nameAr": "هرمون الغدة الدرقية (TSH)",
        "nameEn": "Thyroid Stimulating Hormone",
        "category": "الهرمونات والغدد (Endocrinology)",
        "tube": "Serum Clot Activator (أنبوبة صفراء جل)",
        "price": 200,
        "parameters": [
            {
                "key": "tsh",
                "name": "TSH Ultrasensitive",
                "unit": "uIU/mL",
                "min": 0.4,
                "max": 4.2,
                "precision": 2
            }
        ]
    },
    {
        "id": "test-fsh",
        "code": "FSH",
        "nameAr": "هرمون تنشيط الحويصلات (FSH)",
        "nameEn": "Follicle Stimulating Hormone",
        "category": "الهرمونات والغدد (Endocrinology)",
        "tube": "Serum Clot Activator (أنبوبة صفراء جل)",
        "price": 200,
        "parameters": [
            {
                "key": "fsh",
                "name": "FSH Hormone",
                "unit": "mIU/mL",
                "min": 1.5,
                "max": 12.4,
                "precision": 1
            }
        ]
    },
    {
        "id": "test-lh",
        "code": "LH",
        "nameAr": "الهرمون الملوتن (LH)",
        "nameEn": "Luteinizing Hormone (LH)",
        "category": "الهرمونات والغدد (Endocrinology)",
        "tube": "Serum Clot Activator (أنبوبة صفراء جل)",
        "price": 200,
        "parameters": [
            {
                "key": "lh",
                "name": "LH Hormone",
                "unit": "mIU/mL",
                "min": 1.7,
                "max": 8.6,
                "precision": 1
            }
        ]
    },
    {
        "id": "test-t3",
        "code": "T3",
        "nameAr": "هرمون الغدة الدرقية الكلي (Total T3)",
        "nameEn": "Total Triiodothyronine (T3)",
        "category": "الهرمونات والغدد (Endocrinology)",
        "tube": "Serum Clot Activator (أنبوبة صفراء جل)",
        "price": 200,
        "parameters": [
            {
                "key": "t3",
                "name": "Total T3",
                "unit": "ng/mL",
                "min": 0.8,
                "max": 2.0,
                "precision": 2
            }
        ]
    },
    {
        "id": "test-t4",
        "code": "T4",
        "nameAr": "هرمون الثيروكسين الكلي (Total T4)",
        "nameEn": "Total Thyroxine (T4)",
        "category": "الهرمونات والغدد (Endocrinology)",
        "tube": "Serum Clot Activator (أنبوبة صفراء جل)",
        "price": 200,
        "parameters": [
            {
                "key": "t4",
                "name": "Total T4",
                "unit": "ug/dL",
                "min": 5.1,
                "max": 14.1,
                "precision": 1
            }
        ]
    },
    {
        "id": "test-ft3",
        "code": "FT3",
        "nameAr": "هرمون الغدة الدرقية الحر (Free T3)",
        "nameEn": "Free Triiodothyronine (FT3)",
        "category": "الهرمونات والغدد (Endocrinology)",
        "tube": "Serum Clot Activator (أنبوبة صفراء جل)",
        "price": 200,
        "parameters": [
            {
                "key": "ft3",
                "name": "Free T3",
                "unit": "pg/mL",
                "min": 2.0,
                "max": 4.4,
                "precision": 2
            }
        ]
    },
    {
        "id": "test-ft4",
        "code": "FT4",
        "nameAr": "هرمون الثيروكسين الحر (Free T4)",
        "nameEn": "Free Thyroxine (FT4)",
        "category": "الهرمونات والغدد (Endocrinology)",
        "tube": "Serum Clot Activator (أنبوبة صفراء جل)",
        "price": 200,
        "parameters": [
            {
                "key": "ft4",
                "name": "Free T4",
                "unit": "ng/dL",
                "min": 0.93,
                "max": 1.7,
                "precision": 2
            }
        ]
    },
    {
        "id": "test-urine-culture",
        "code": "URINE-CULT",
        "nameAr": "مزرعة وحساسية ميكروبية للبول (Urine Culture)",
        "nameEn": "Urine Culture & Sensitivity",
        "category": "المايكروبيولوجي والبول والبراز",
        "tube": "Sterile Container (علبة معقمة)",
        "price": 200,
        "parameters": [
            {
                "key": "cult_growth",
                "name": "Microbial Growth",
                "unit": "CFU/mL",
                "min": 0,
                "max": 10000,
                "precision": 0
            }
        ]
    },
    {
        "id": "test-crp",
        "code": "CRP",
        "nameAr": "البروتين المتفاعل C (الالتهابات)",
        "nameEn": "C-Reactive Protein (CRP)",
        "category": "المناعة والأمصال (Serology)",
        "tube": "Serum Clot Activator (أنبوبة صفراء جل)",
        "price": 80,
        "parameters": [
            {
                "key": "crp",
                "name": "C-Reactive Protein",
                "unit": "mg/L",
                "min": 0,
                "max": 6.0,
                "precision": 1
            }
        ]
    },
    {
        "id": "test-asot",
        "code": "ASOT",
        "nameAr": "سرعة التهاب اللوز والمكورات (ASOT)",
        "nameEn": "Anti-Streptolysin O Titre",
        "category": "المناعة والأمصال (Serology)",
        "tube": "Serum Clot Activator (أنبوبة صفراء جل)",
        "price": 80,
        "parameters": [
            {
                "key": "asot",
                "name": "ASOT Titre",
                "unit": "IU/mL",
                "min": 0,
                "max": 200,
                "precision": 0
            }
        ]
    },
    {
        "id": "test-rf",
        "code": "RF",
        "nameAr": "معامل الروماتويد (RF)",
        "nameEn": "Rheumatoid Factor (RF)",
        "category": "المناعة والأمصال (Serology)",
        "tube": "Serum Clot Activator (أنبوبة صفراء جل)",
        "price": 80,
        "parameters": [
            {
                "key": "rf",
                "name": "Rheumatoid Factor",
                "unit": "IU/mL",
                "min": 0,
                "max": 8,
                "precision": 0
            }
        ]
    },
    {
        "id": "test-esr",
        "code": "ESR",
        "nameAr": "سرعة الترسيب (ESR)",
        "nameEn": "Erythrocyte Sedimentation Rate",
        "category": "أمراض الدم (Hematology)",
        "tube": "Sodium Citrate (أنبوبة سوداء)",
        "price": 60,
        "parameters": [
            {
                "key": "esr_1hr",
                "name": "ESR (1st Hour)",
                "unit": "mm/hr",
                "min": 0,
                "max": 15,
                "femaleMin": 0,
                "femaleMax": 20,
                "precision": 0
            },
            {
                "key": "esr_2hr",
                "name": "ESR (2nd Hour)",
                "unit": "mm/hr",
                "min": 0,
                "max": 30,
                "femaleMin": 0,
                "femaleMax": 35,
                "precision": 0
            }
        ]
    },
    {
        "id": "test-pt",
        "code": "PT",
        "nameAr": "سيولة دم وزمن البروثرومبين (PT / INR)",
        "nameEn": "Prothrombin Time & INR",
        "category": "أمراض الدم (Hematology)",
        "tube": "Sodium Citrate (أنبوبة زرقاء)",
        "price": 80,
        "parameters": [
            {
                "key": "pt_time",
                "name": "PT (Patient Time)",
                "unit": "Seconds",
                "min": 11.0,
                "max": 13.5,
                "precision": 1
            },
            {
                "key": "inr",
                "name": "INR",
                "unit": "Ratio",
                "min": 0.8,
                "max": 1.2,
                "precision": 2
            }
        ]
    },
    {
        "id": "test-ptt",
        "code": "PTT",
        "nameAr": "زمن الثرومبوبلاستين الجزئي (aPTT)",
        "nameEn": "Activated Partial Thromboplastin Time",
        "category": "أمراض الدم (Hematology)",
        "tube": "Sodium Citrate (أنبوبة زرقاء)",
        "price": 80,
        "parameters": [
            {
                "key": "aptt_time",
                "name": "aPTT (Patient Time)",
                "unit": "Seconds",
                "min": 25.0,
                "max": 35.0,
                "precision": 1
            }
        ]
    },
    {
        "id": "test-ct",
        "code": "CT",
        "nameAr": "زمن ومعدل التجلط (Clotting Time)",
        "nameEn": "Clotting Time (CT)",
        "category": "أمراض الدم (Hematology)",
        "tube": "Plain Glass Tube",
        "price": 50,
        "parameters": [
            {
                "key": "ct_val",
                "name": "Clotting Time",
                "unit": "Minutes",
                "min": 5,
                "max": 11,
                "precision": 1
            }
        ]
    },
    {
        "id": "test-bt",
        "code": "BT",
        "nameAr": "زمن ومعدل النزف (Bleeding Time)",
        "nameEn": "Bleeding Time (BT)",
        "category": "أمراض الدم (Hematology)",
        "tube": "Capillary Tube",
        "price": 50,
        "parameters": [
            {
                "key": "bt_val",
                "name": "Bleeding Time",
                "unit": "Minutes",
                "min": 1,
                "max": 4,
                "precision": 1
            }
        ]
    },
    {
        "id": "test-hcv",
        "code": "HCV",
        "nameAr": "أجسام مضادة لفيروس سي (Anti-HCV)",
        "nameEn": "Hepatitis C Virus Antibody",
        "category": "الفيروسات والمناعة (Virology)",
        "tube": "Serum Clot Activator (أنبوبة صفراء جل)",
        "price": 120,
        "parameters": [
            {
                "key": "hcv_res",
                "name": "Anti-HCV Antibody",
                "unit": "Qualitative",
                "min": 0,
                "max": 0,
                "precision": 0
            }
        ]
    },
    {
        "id": "test-hbsag",
        "code": "HBsAg",
        "nameAr": "فيروس بي السطحي (HBsAg)",
        "nameEn": "Hepatitis B Surface Antigen",
        "category": "الفيروسات والمناعة (Virology)",
        "tube": "Serum Clot Activator (أنبوبة صفراء جل)",
        "price": 120,
        "parameters": [
            {
                "key": "hbsag_res",
                "name": "HBsAg",
                "unit": "Qualitative",
                "min": 0,
                "max": 0,
                "precision": 0
            }
        ]
    },
    {
        "id": "test-hiv",
        "code": "HIV",
        "nameAr": "تحليل الإيدز (HIV 1 & 2)",
        "nameEn": "Human Immunodeficiency Virus (HIV)",
        "category": "الفيروسات والمناعة (Virology)",
        "tube": "Serum Clot Activator (أنبوبة صفراء جل)",
        "price": 120,
        "parameters": [
            {
                "key": "hiv_res",
                "name": "HIV 1/2 Antibodies",
                "unit": "Qualitative",
                "min": 0,
                "max": 0,
                "precision": 0
            }
        ]
    },
    {
        "id": "test-pcr-hcv",
        "code": "PCR-HCV",
        "nameAr": "كشف فيروس C كمي بالـ PCR",
        "nameEn": "HCV RNA Quantitative PCR",
        "category": "البيولوجيا الجزيئية (Molecular / PCR)",
        "tube": "EDTA (أنبوبة بنفسجي)",
        "price": 400,
        "parameters": [
            {
                "key": "pcr_hcv",
                "name": "HCV Viral Load",
                "unit": "IU/mL",
                "min": 0,
                "max": 15,
                "precision": 0
            }
        ]
    },
    {
        "id": "test-pcr-hbv",
        "code": "PCR-HBV",
        "nameAr": "كشف فيروس B كمي بالـ PCR",
        "nameEn": "HBV DNA Quantitative PCR",
        "category": "البيولوجيا الجزيئية (Molecular / PCR)",
        "tube": "EDTA (أنبوبة بنفسجي)",
        "price": 400,
        "parameters": [
            {
                "key": "pcr_hbv",
                "name": "HBV Viral Load",
                "unit": "IU/mL",
                "min": 0,
                "max": 10,
                "precision": 0
            }
        ]
    },
    {
        "id": "test-vitd",
        "code": "VIT-D",
        "nameAr": "فيتامين د الكلي في الدم (Vitamin D)",
        "nameEn": "25-Hydroxy Vitamin D Total",
        "category": "الهرمونات والغدد (Endocrinology)",
        "tube": "Serum Clot Activator (أنبوبة صفراء جل)",
        "price": 400,
        "parameters": [
            {
                "key": "vitd_val",
                "name": "25-OH Vitamin D",
                "unit": "ng/mL",
                "min": 30.0,
                "max": 100.0,
                "precision": 1
            }
        ]
    },
    {
        "id": "test-blood-group",
        "code": "ABO",
        "nameAr": "فصيلة الدم وعامل ريسس (ABO & Rh)",
        "nameEn": "Blood Grouping (ABO & Rh Factor)",
        "category": "أمراض الدم (Hematology)",
        "tube": "EDTA (أنبوبة بنفسجي)",
        "price": 80,
        "parameters": [
            {
                "key": "abo_group",
                "name": "ABO Group",
                "unit": "Type",
                "min": 0,
                "max": 0,
                "precision": 0
            },
            {
                "key": "rh_factor",
                "name": "Rh Factor (D Antigen)",
                "unit": "Type",
                "min": 0,
                "max": 0,
                "precision": 0
            }
        ]
    },
    {
        "id": "test-ferritin",
        "code": "FERRITIN",
        "nameAr": "مخزون الحديد في الدم (Serum Ferritin)",
        "nameEn": "Serum Ferritin",
        "category": "أمراض الدم (Hematology)",
        "tube": "Serum Clot Activator (أنبوبة صفراء جل)",
        "price": 250,
        "parameters": [
            {
                "key": "ferritin",
                "name": "Serum Ferritin",
                "unit": "ng/mL",
                "min": 30.0,
                "max": 400.0,
                "femaleMin": 13.0,
                "femaleMax": 150.0,
                "precision": 1
            }
        ]
    },
    {
        "id": "test-drugs",
        "code": "DRUGS-PANEL",
        "nameAr": "تحليل مخدرات متعدد (Drug Screen Panel)",
        "nameEn": "Multi-Drug Abuse Screen Panel",
        "category": "السموم والمخدرات (Toxicology)",
        "tube": "Urine Cup (كوب معقم)",
        "price": 300,
        "parameters": [
            {
                "key": "thc",
                "name": "THC (Cannabis / الحشيش)",
                "unit": "Qual",
                "min": 0,
                "max": 0,
                "precision": 0
            },
            {
                "key": "opi",
                "name": "Opiates (المورفين والأفيونات)",
                "unit": "Qual",
                "min": 0,
                "max": 0,
                "precision": 0
            },
            {
                "key": "tml",
                "name": "Tramadol (الترامادول)",
                "unit": "Qual",
                "min": 0,
                "max": 0,
                "precision": 0
            }
        ]
    },
    {
        "id": "test-amyloid-a",
        "code": "SAA",
        "nameAr": "تحليل بروتين أميلويد A (Amyloid A Protein)",
        "nameEn": "Serum Amyloid A Protein (SAA)",
        "category": "المناعة والأمصال (Serology)",
        "tube": "Serum Clot Activator (أنبوبة صفراء جل)",
        "price": 300,
        "parameters": [
            {
                "key": "saa_val",
                "name": "Serum Amyloid A",
                "unit": "mg/L",
                "min": 0,
                "max": 10.0,
                "precision": 1
            }
        ]
    },
    {
        "id": "test-widal",
        "code": "WIDAL",
        "nameAr": "حمى التيفود والباراتيفود (Widal Test)",
        "nameEn": "Widal Agglutination Test",
        "category": "المناعة والأمصال (Serology)",
        "tube": "Serum Clot Activator (أنبوبة صفراء جل)",
        "price": 200,
        "parameters": [
            {
                "key": "widal_to",
                "name": "S. Typhi O Antigen",
                "unit": "Titre",
                "min": 0,
                "max": 80,
                "precision": 0
            },
            {
                "key": "widal_th",
                "name": "S. Typhi H Antigen",
                "unit": "Titre",
                "min": 0,
                "max": 80,
                "precision": 0
            }
        ]
    },
    {
        "id": "test-anemia-hb",
        "code": "HB",
        "nameAr": "تحليل أنيميا أو هيموجلوبين في الدم (Hb)",
        "nameEn": "Hemoglobin (Hb)",
        "category": "أمراض الدم (Hematology)",
        "tube": "EDTA (أنبوبة بنفسجي)",
        "price": 100,
        "parameters": [
            {
                "key": "hb_isolated",
                "name": "Hemoglobin Concentration",
                "unit": "g/dL",
                "min": 13.0,
                "max": 17.5,
                "femaleMin": 12.0,
                "femaleMax": 15.5,
                "precision": 1
            }
        ]
    },
    {
        "id": "test-prolactin",
        "code": "PROLACTIN",
        "nameAr": "هرمون اللبن (Prolactin)",
        "nameEn": "Serum Prolactin Hormone",
        "category": "الهرمونات والغدد (Endocrinology)",
        "tube": "Serum Clot Activator (أنبوبة صفراء جل)",
        "price": 200,
        "parameters": [
            {
                "key": "prolactin",
                "name": "Prolactin",
                "unit": "ng/mL",
                "min": 4.0,
                "max": 15.2,
                "femaleMin": 4.8,
                "femaleMax": 23.3,
                "precision": 1
            }
        ]
    },
    {
        "id": "test-amh",
        "code": "AMH",
        "nameAr": "هرمون مخزون المبيض (AMH)",
        "nameEn": "Anti-Müllerian Hormone (AMH)",
        "category": "الهرمونات والغدد (Endocrinology)",
        "tube": "Serum Clot Activator (أنبوبة صفراء جل)",
        "price": 500,
        "parameters": [
            {
                "key": "amh_val",
                "name": "AMH Hormone",
                "unit": "ng/mL",
                "min": 1.0,
                "max": 4.0,
                "precision": 2
            }
        ]
    },
    {
        "id": "test-semen",
        "code": "SEMEN",
        "nameAr": "فحص السائل المنوي الشامل (Semen Analysis)",
        "nameEn": "Complete Semen Analysis",
        "category": "المايكروبيولوجي والبول والبراز",
        "tube": "Sterile Container (علبة معقمة)",
        "price": 200,
        "parameters": [
            {
                "key": "semen_vol",
                "name": "Volume",
                "unit": "mL",
                "min": 1.5,
                "max": 5.0,
                "precision": 1
            },
            {
                "key": "semen_count",
                "name": "Sperm Count",
                "unit": "Million/mL",
                "min": 15,
                "max": 200,
                "precision": 0
            },
            {
                "key": "semen_motility",
                "name": "Total Motility (PR+NP)",
                "unit": "%",
                "min": 40,
                "max": 100,
                "precision": 0
            }
        ]
    },
    {
        "id": "test-g6pd",
        "code": "G6PD",
        "nameAr": "أنيميا الفول (G6PD Enzyme)",
        "nameEn": "Glucose-6-Phosphate Dehydrogenase",
        "category": "أمراض الدم (Hematology)",
        "tube": "EDTA (أنبوبة بنفسجي)",
        "price": 300,
        "parameters": [
            {
                "key": "g6pd_act",
                "name": "G6PD Activity",
                "unit": "U/g Hb",
                "min": 8.0,
                "max": 18.0,
                "precision": 1
            }
        ]
    },
    {
        "id": "test-calcium",
        "code": "CALCIUM",
        "nameAr": "كالسيوم توتال في الدم (Calcium Total)",
        "nameEn": "Total Serum Calcium",
        "category": "كيمياء الدم العامة (Clinical Chemistry)",
        "tube": "Serum Clot Activator (أنبوبة صفراء جل)",
        "price": 150,
        "parameters": [
            {
                "key": "calcium_val",
                "name": "Total Calcium",
                "unit": "mg/dL",
                "min": 8.5,
                "max": 10.5,
                "precision": 1
            }
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
