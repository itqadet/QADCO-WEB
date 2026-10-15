import type { L } from "./localized";

/** QADCO's method statement (profile pp.16–19), as three stages of submittal items. */
export type Stage = {
  id: string;
  code: string;
  title: L;
  summary: L;
  items: { title: L; body: L }[];
};

export const stages: Stage[] = [
  {
    id: "pre-contract",
    code: "MS-01",
    title: { en: "Before the contract", ar: "قبل التعاقد" },
    summary: {
      en: "Everything is agreed on paper before material is ordered or anyone reaches site.",
      ar: "يُتّفق على كل شيء على الورق قبل طلب المواد أو الوصول إلى الموقع.",
    },
    items: [
      {
        title: { en: "Contract review", ar: "مراجعة العقد" },
        body: {
          en: "A pre-contract meeting with you goes through our tender in detail: the scope is defined, preliminaries agreed and grey areas settled. We then submit our pre-qualification, quality plan, method statement and safety requirements.",
          ar: "نعقد معكم اجتماعًا قبل التعاقد نراجع فيه عرضنا بالتفصيل: يُحدَّد نطاق العمل وتُتّفق المتطلبات الأولية وتُحسم النقاط الغامضة. ثم نقدّم وثائق التأهيل المسبق وخطة الجودة وبيان طريقة العمل ومتطلبات السلامة.",
        },
      },
      {
        title: { en: "Material approvals", ar: "اعتماد المواد" },
        body: {
          en: "Samples are submitted on your material submission form, following the submittal schedule and the specification.",
          ar: "تُقدَّم العينات على نموذج تقديم المواد الخاص بكم، وفق جدول التقديمات والمواصفات.",
        },
      },
      {
        title: { en: "Mock-up approval", ar: "اعتماد النموذج التجريبي" },
        body: {
          en: "We draw the mock-up for approval, then build it on site with the approved materials so the consultant can review the real thing.",
          ar: "نرسم النموذج التجريبي للاعتماد، ثم ننفّذه في الموقع بالمواد المعتمدة ليراجعه الاستشاري على أرض الواقع.",
        },
      },
      {
        title: { en: "Programme of works", ar: "البرنامج الزمني للأعمال" },
        body: {
          en: "Our programme fits yours and shows three things: shipment from the manufacturer, delivery to site, and the installation sequence.",
          ar: "يتوافق برنامجنا مع برنامجكم ويوضّح ثلاثة أمور: الشحن من المصنّع، والتوريد إلى الموقع، وتسلسل التركيب.",
        },
      },
      {
        title: { en: "Shop drawings", ar: "المخططات التنفيذية" },
        body: {
          en: "From the tender drawings and a detailed site survey we draw fixing and finishing details to as-built dimensions, and submit them in four sets for the consultant's approval code.",
          ar: "من مخططات المناقصة ومسح تفصيلي للموقع نرسم تفاصيل التثبيت والتشطيب وفق الأبعاد المنفّذة فعليًا، ونقدّمها في أربع نسخ ليمنحها الاستشاري رمز الاعتماد.",
        },
      },
    ],
  },
  {
    id: "installation",
    code: "MS-02",
    title: { en: "Installation on site", ar: "التركيب في الموقع" },
    summary: {
      en: "Our own team installs to the approved drawings, with checks before, during and after.",
      ar: "يركّب فريقنا وفق المخططات المعتمدة، مع فحوصات قبل التركيب وأثناءه وبعده.",
    },
    items: [
      {
        title: { en: "Site readiness", ar: "جاهزية الموقع" },
        body: {
          en: "We review the installation programme with your site representative and our supervisor confirms the area is ready to receive material.",
          ar: "نراجع برنامج التركيب مع ممثلكم في الموقع، ويؤكّد مشرفنا جاهزية المنطقة لاستلام المواد.",
        },
      },
      {
        title: { en: "Delivery and storage", ar: "التوريد والتخزين" },
        body: {
          en: "Material is offloaded to the agreed storage area and your quality-control representative is invited to inspect it.",
          ar: "تُفرَّغ المواد في منطقة التخزين المتّفق عليها، ويُدعى ممثل ضبط الجودة لديكم لفحصها.",
        },
      },
      {
        title: { en: "Pre-installation check", ar: "فحص ما قبل التركيب" },
        body: {
          en: "Our site supervisor carries out a quality check before work starts, and the area is kept clear with safe access.",
          ar: "يُجري مشرف الموقع فحصًا للجودة قبل بدء العمل، وتبقى المنطقة نظيفة بممرات آمنة.",
        },
      },
      {
        title: { en: "Installation and inspection", ar: "التركيب والفحص" },
        body: {
          en: "A qualified team installs to the approved programme. Your representative inspects during and after installation.",
          ar: "يركّب فريق مؤهّل وفق البرنامج المعتمد، ويفحص ممثلكم العمل أثناء التركيب وبعده.",
        },
      },
      {
        title: { en: "Protection and handover", ar: "الحماية والتسليم" },
        body: {
          en: "After our quality check, finished work is wrapped and protected. Wraps come off for the final inspection and handover.",
          ar: "بعد فحص الجودة تُغلَّف الأعمال المنجزة لحمايتها، ثم تُزال الأغلفة للفحص النهائي والتسليم.",
        },
      },
    ],
  },
  {
    id: "post-contract",
    code: "MS-03",
    title: { en: "After handover", ar: "بعد التسليم" },
    summary: {
      en: "We leave the site in order and stay on call through the maintenance period.",
      ar: "نغادر الموقع بشكل منظّم ونبقى على أهبة الاستعداد طوال فترة الصيانة.",
    },
    items: [
      {
        title: { en: "Demobilisation", ar: "إخلاء الموقع" },
        body: {
          en: "People and materials leave site in a planned, phased way.",
          ar: "يغادر الفريق والمواد الموقع بطريقة مخطّطة وعلى مراحل.",
        },
      },
      {
        title: { en: "As-built drawings and O&M manual", ar: "المخططات حسب التنفيذ ودليل التشغيل والصيانة" },
        body: {
          en: "A complete set of as-built drawings and the operation and maintenance manual are submitted.",
          ar: "تُقدَّم مجموعة كاملة من المخططات حسب التنفيذ مع دليل التشغيل والصيانة.",
        },
      },
      {
        title: { en: "Completion certificate", ar: "شهادة الإنجاز" },
        body: {
          en: "We follow up with the engineer's representative for the formal certificate of completion, then submit final accounts.",
          ar: "نتابع مع ممثل المهندس للحصول على شهادة الإنجاز الرسمية، ثم نقدّم الحسابات الختامية.",
        },
      },
      {
        title: { en: "Maintenance period", ar: "فترة الصيانة" },
        body: {
          en: "Our representative stays on call for the full maintenance period. Every product carries its manufacturer's warranty, passed on to you directly.",
          ar: "يبقى ممثلنا متاحًا طوال فترة الصيانة. وكل منتج يحمل ضمان الشركة المصنّعة الذي يُنقل إليكم مباشرة.",
        },
      },
    ],
  },
];

/** The approval codes consultants return on submittals, as used in QADCO's own documents. */
export const approvalCodes = [
  { code: "A", label: { en: "Approved", ar: "معتمد" }, tone: "ok" },
  { code: "B", label: { en: "Approved with comments", ar: "معتمد مع ملاحظات" }, tone: "ok" },
  { code: "C", label: { en: "Revise and resubmit", ar: "يُعدَّل ويُعاد تقديمه" }, tone: "warn" },
  { code: "D", label: { en: "Not approved", ar: "غير معتمد" }, tone: "stop" },
] as const;
