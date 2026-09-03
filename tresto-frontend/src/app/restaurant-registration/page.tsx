import Header from "../components/header";
import RegistrationField from "../components/registration-fields";
import RegistrationFields from "../components/registration-fields";
import RegistrationForm, { RegistrationFieldData } from "../components/registration-form";
import RouteButton from "../components/route-button";

const adminFields = [
    {
        label: "اسم المطعم",
        name: "restaurantName",
        placeholder: "أدخل اسم المطعم",
        type: "text",
        required: true,
    },
    {
        label: "الإسم",
        name: "name",
        placeholder: "أدخل إسمك الكامل",
        type: "text",
        required: true,
    },
    {
        label: "اسم المستخدم",
        name: "username",
        placeholder: "أدخل إسم المستخدم",
        type: "text",
        required: true,
    },
    {
        label: "كلمة المرور",
        name: "password",
        placeholder: "أدخل كلمة المرور",
        type: "password",
        required: true,
        minLength: 6,
    },
    {
        label: "تأكيد كلمة المرور",
        name: "confirmPassword",
        placeholder: "أدخل تأكيد كلمة المرور",
        type: "password",
        required: true,
        minLength: 6,
    },
]satisfies RegistrationFieldData[];

export default function RestaurantRegistrationPage() {
    return (
        <div className="bg-[#FDFCFE] text-foreground font-sans min-h-screen" dir="rtl">

            <div
                dir="rtl"
                className="min-h-screen bg-[#FDFCFE] flex flex-col items-center px-4 font-sans"
            >


                <RegistrationForm
                    fields={adminFields}
                    formTitle="أنشئ حساب المدير الخاص بك"
                    formDescription="لنبدأ بإعداد بيانات الاعتماد الخاصة بك."
                    route="/restaurant-registration/appearance"
                    storageKey="admin_info"
                />
            </div>
        </div>
    );
}