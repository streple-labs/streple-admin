import Signup from "@/components/auth/signup";
import AuthPageWrappper from "@/components/auth/wrapper";

export default function page() {
  return (
    <AuthPageWrappper>
      <Signup />
    </AuthPageWrappper>
  );
}
