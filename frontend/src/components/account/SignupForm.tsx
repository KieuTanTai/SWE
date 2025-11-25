import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { faFacebook as faFacebookBrand, faGoogle as faGoogleBrand } from '@fortawesome/free-brands-svg-icons';
import SignupFormProps from '@/props/account/SignupFormProps';
import { useMessageModalProvider } from '@/hooks/useMessageModalContext';
import UseForm from '@/hooks/useAuth';
import { UISignupData } from '@/props/ui-props/accounts/Signup';
import { Account } from '@/interfaces';
import { signup } from '@/api/auth-api';

function SignupForm({ onSuccess, onLoginLinkClick }: SignupFormProps) {
     const { showMessage } = useMessageModalProvider();
     const { formData, isSubmitting, userNameErrorMessage, passwordErrorMessage, handleChange, handleSubmit, handleCopy }
          = UseForm(
               { email: "", password: "", confirmPassword: "" },
               async (data: UISignupData): Promise<Account> => {
                    try {
                         const result = await signup(data);
                         if (!(result instanceof Array) && result && result.account_email !== "") {
                              onSuccess();
                              showMessage("Đăng ký thành công! Vui lòng đăng nhập.", "success");
                              return result;
                         }
                         else if (result instanceof Array)
                              showMessage(result[0].message ?? "lỗi khi đăng kí, kiểm tra lại thông tin ", "error");
                         else
                              showMessage("lỗi khi đăng kí, vui lòng thử lại!", "error");
                         return {} as Account;
                    } catch (error) {
                         if (error instanceof Error)
                              throw new Error(error.message);
                         else
                              throw new Error('An unknown error occurred during submission.');
                    }
               }
          )

     return (
          <div className="w-full max-w-lg space-y-6 rounded-xl border border-gray-200 bg-white p-8 shadow-lg">
               <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Chào mừng đến với cửa hàng</h2>
                    <p className="mt-2 text-sm text-gray-500">Đăng ký tài khoản để tiếp tục</p>
               </div>

               <form className="space-y-4" onSubmit={handleSubmit} id='signup-form'>
                    {/* Username */}
                    <div>
                         <label htmlFor="signup-email" className="sr-only">Username</label>
                         <div className="relative">
                              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                   <FontAwesomeIcon icon={faUserCircle} className="text-gray-400" />
                              </div>
                              <input
                                   id="signup-email"
                                   name="email"
                                   type="email"
                                   autoComplete="email"
                                   required
                                   placeholder="Email"
                                   value={formData.email}
                                   disabled={isSubmitting}
                                   onChange={(e) => handleChange(e, true)}
                                   className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm placeholder-gray-400 shadow-sm focus:outline-none"
                              />
                         </div>
                         <div className="mt-1 h-4 text-xs text-red-500" id="signup-email-error-msg">
                              {userNameErrorMessage}
                         </div>
                    </div>

                    {/* Mật khẩu */}
                    <div>
                         <label htmlFor="signup-password" className="sr-only">Mật khẩu</label>
                         <div className="relative">
                              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                   <FontAwesomeIcon icon={faLock} className="text-gray-400" />
                              </div>
                              <input
                                   id="signup-password"
                                   name="password"
                                   type="password"
                                   autoComplete="new-password"
                                   required
                                   placeholder="Mật khẩu"
                                   disabled={isSubmitting}
                                   value={formData.password}
                                   onCopy={handleCopy}
                                   onChange={(e) => handleChange(e, false, true)}
                                   className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm placeholder-gray-400 shadow-sm focus:outline-none"
                              />
                         </div>
                         <div className="mt-1 h-4 text-xs text-red-500" id="signup-pass-error-msg">
                              {passwordErrorMessage}
                         </div>
                    </div>

                    {/* Nhập lại mật khẩu */}
                    <div>
                         <label htmlFor="signup-confirm-password" className="sr-only">Nhập lại mật khẩu</label>
                         <div className="relative">
                              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                   <FontAwesomeIcon icon={faLock} className="text-gray-400" />
                              </div>
                              <input
                                   id="signup-confirm-password"
                                   name="confirmPassword"
                                   type="password"
                                   autoComplete="new-password"
                                   required
                                   placeholder="Nhập lại mật khẩu"
                                   disabled={isSubmitting}
                                   value={formData.confirmPassword}
                                   onCopy={handleCopy}
                                   onChange={(e) => handleChange(e, false, false)}
                                   className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm placeholder-gray-400 shadow-sm focus:outline-none"
                              />
                         </div>
                         <div className="mt-1 h-4 text-xs text-red-500" id="signup-confirm-pass-error-msg">
                         </div>
                    </div>

                    {/* {message && (
                         <div
                              className={`p-3 text-center text-sm rounded-lg ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
                              role="alert"
                         >
                              {message}
                         </div>
                    )} */}

                    {/* Register button */}
                    <div>
                         <button
                              type="submit"
                              onSubmit={handleSubmit}
                              className="main-background flex w-full justify-center rounded-lg border border-transparent px-4 py-2 
                                   text-sm font-medium shadow-sm">
                              Đăng ký
                         </button>
                    </div>
               </form>

               {/* Separator */}
               <div className="relative mt-6">
                    <div className="absolute inset-0 flex items-center">
                         <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                         <span className="bg-white px-2 text-gray-500">Hoặc</span>
                    </div>
               </div>

               {/* Social signup buttons */}
               <div className="flex space-x-2">
                    <button id="signup-google" className="main-background flex w-1/2 items-center justify-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 shadow-sm focus:outline-none">
                         <FontAwesomeIcon icon={faGoogleBrand} className="h-4 w-4" />
                         <span>Google</span>
                    </button>
                    <button id="signup-facebook" className="main-background flex w-1/2 items-center justify-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 shadow-sm focus:outline-none">
                         <FontAwesomeIcon icon={faFacebookBrand} className="h-4 w-4" />
                         <span>Facebook</span>
                    </button>
               </div>

               {/* Login link */}
               <div className="mt-6 text-center text-sm text-gray-500">
                    Đã có tài khoản?{' '}
                    <a href="#" onClick={onLoginLinkClick}
                         className="font-medium text-blue-600 hover:text-blue-500">
                         Đăng nhập ngay
                    </a>
               </div>
          </div>
     );
};

export default SignupForm;