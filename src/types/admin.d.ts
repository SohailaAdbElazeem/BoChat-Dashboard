// File: app/accounts/types.ts
export type Account = {
id: string;
email: string;
name: string;
active: boolean;
};


export type AddAdminPayload = {
userid: string;
rules: string[];
};


// File: app/accounts/_lib/roles.ts
export const ROLE_LABEL_TO_KEY: Record<string, string> = {
"حذف الحسابات": "delete",
"الإبلاغات": "report",
"إضافة الحسابات": "add",
"نشر النصائح": "publish",
"محتوى المحظور": "blockedContent",
"حظر المستخدمين": "block",
"توثيق المستخدمين": "verify",
"قبول طلبات الدعم": "accept",
"مشاهدة المستند…": "watch",
};


export const ALL_ROLES_AR: string[] = [
"حذف الحسابات",
"الإبلاغات",
"إضافة الحسابات",
"نشر النصائح",
"حظر المستخدمين",
"محتوى المحظور",
"مشاهدة المستند…",
"قبول طلبات الدعم",
"توثيق المستخدمين",
];


export function mapArabicRolesToKeys(labels: string[]): string[] {
return labels.map((l) => ROLE_LABEL_TO_KEY[l]).filter(Boolean);
}