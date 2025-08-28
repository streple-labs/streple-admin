import { anton } from "@/app/fonts";
import Loader from "../ui/loader";

export default function ForgotPasswordForm({
  loading,
  email,
  handleChange,
  handleForgotPassword,
}: {
  loading: boolean;
  email: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleForgotPassword: () => void;
}) {
  return (
    <form
      className="size-full flex items-center justify-center flex-col gap-[40px] md:gap-[60px]"
      onSubmit={(e) => {
        e.preventDefault();
        handleForgotPassword();
      }}
    >
      <div className="space-y-8 w-full">
        <div className="w-full flex items-center justify-center flex-col gap-4">
          <h4
            className={`tracking-[2px] leading-[150%] font-normal text-2xl md:text-3xl lg:text-4xl ${anton.className} w-full text-center`}
          >
            Forgot password
          </h4>
          <p className="text-sm md:text-base leading-6 tracking-[1px] font-normal w-full text-center">
            Enter the email linked to your password to get a reset code
          </p>
        </div>

        <label className="space-y-1.5 md:space-y-3">
          <p className="font-normal text-sm md:text-base leading-6 tracking-[1px]">
            Email address
          </p>
          <input
            value={email}
            name="email"
            onChange={handleChange}
            required
            pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
            title="Please enter a valid email address"
            type="text"
            placeholder="e.g johndoe@gmail.com"
            className={`h-[60px] md:h-[82px] w-full text-base py-5 px-3 md:px-6 rounded-[10px] md:rounded-[20px] gap-4 leading-6 tracking-[1px] placeholder:text-white/50 outline-0 ring-0 caret-[#B39FF0] ${
              email
                ? "text-[#FFFFFF99] bg-[#F4E90E1A] border border-[#F4E90EB2] focus:bg-[#242324] focus:text-white focus:border-0"
                : "bg-[#242324] text-white"
            }`}
          />
        </label>
      </div>
      <button
        disabled={loading}
        className="w-full py-3 px-4 rounded-[10px] md:rounded-[20px] h-[61px] md:h-[84px] bg-[#B39FF0] hover:bg-[#B39FF0]/90 text-[#2C2C26] text-base md:text-xl font-bold leading-[150%] tracking-[2px] flex items-center justify-center"
        title="forgot password"
        type="submit"
      >
        {loading ? <Loader /> : "Continue"}
      </button>
    </form>
  );
}
