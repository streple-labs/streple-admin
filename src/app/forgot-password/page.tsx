import ForgotPassword from "@/components/auth/forgot-password";
import AuthPageWrappper from "@/components/auth/wrapper";

export default function page() {
  return (
    <AuthPageWrappper>
      <ForgotPassword />
    </AuthPageWrappper>
  );
}
