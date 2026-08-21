import React, { useState, useEffect } from 'react';
import { SiteSettings } from '../../types';
import { getRegisteredAdminFromDb, registerMasterAdminInDb, AdminAuthRecord } from '../../lib/firestoreService';

interface WordPressAuthProps {
  siteSettings?: SiteSettings;
  onLoginSuccess: (user: { username: string; email: string; name: string }) => void;
  onBackToSite: () => void;
}

export const WordPressAuth: React.FC<WordPressAuthProps> = ({
  siteSettings,
  onLoginSuccess,
  onBackToSite,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'lostpassword'>('login');
  const [registeredAdmin, setRegisteredAdmin] = useState<AdminAuthRecord | null>(null);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);

  // Login Form State
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Register Form State (Only for the first single admin)
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regFullName, setRegFullName] = useState('');

  // Lost Password State
  const [lostEmail, setLostEmail] = useState('');

  // Feedback State
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const siteTitle = siteSettings?.siteTitle ? siteSettings.siteTitle.split('-')[0].trim() : 'Doyel Television';

  // Check on mount if admin already exists in Firestore / localStorage
  useEffect(() => {
    let isMounted = true;
    async function checkAdmin() {
      try {
        // First check localStorage cache
        const local = localStorage.getItem('wp_master_admin');
        if (local) {
          try {
            const parsed = JSON.parse(local);
            if (parsed && parsed.username) {
              if (isMounted) {
                setRegisteredAdmin(parsed);
                setAuthMode('login');
              }
            }
          } catch (e) {
            console.error(e);
          }
        }

        // Then check remote Firestore
        const remoteAdmin = await getRegisteredAdminFromDb();
        if (isMounted) {
          if (remoteAdmin) {
            setRegisteredAdmin(remoteAdmin);
            localStorage.setItem('wp_master_admin', JSON.stringify(remoteAdmin));
            setAuthMode('login');
          } else {
            // No admin in DB: if also no local, allow first-time registration
            if (!local) {
              setRegisteredAdmin(null);
              setAuthMode('register');
            }
          }
          setIsCheckingAdmin(false);
        }
      } catch (err) {
        console.error('Error checking admin:', err);
        if (isMounted) setIsCheckingAdmin(false);
      }
    }

    checkAdmin();
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const inputUser = usernameOrEmail.trim().toLowerCase();
    const inputPass = password.trim();

    if (!inputUser || !inputPass) {
      setErrorMsg('ত্রুটি: অনুগ্রহ করে আপনার ব্যবহারকারীর নাম বা ইমেইল এবং পাসওয়ার্ড প্রদান করুন।');
      return;
    }

    setIsLoading(true);

    try {
      // Ensure we have latest admin from Firestore if not yet loaded
      let currentAdmin = registeredAdmin;
      if (!currentAdmin) {
        currentAdmin = await getRegisteredAdminFromDb();
        if (currentAdmin) {
          setRegisteredAdmin(currentAdmin);
          localStorage.setItem('wp_master_admin', JSON.stringify(currentAdmin));
        }
      }

      if (!currentAdmin) {
        // No admin registered anywhere yet
        setIsLoading(false);
        setErrorMsg('কোনো অ্যাডমিন অ্যাকাউন্ট পাওয়া যায়নি। অনুগ্রহ করে প্রথমে সাইন-আপ করে অ্যাকাউন্ট তৈরি করুন।');
        setAuthMode('register');
        return;
      }

      // Check strictly against the registered admin credentials
      const matchesUser =
        currentAdmin.username.toLowerCase() === inputUser ||
        currentAdmin.email.toLowerCase() === inputUser;

      const matchesPass = currentAdmin.passwordHash === inputPass;

      if (matchesUser && matchesPass) {
        const loggedInUser = {
          username: currentAdmin.username,
          email: currentAdmin.email,
          name: currentAdmin.fullName || currentAdmin.username,
        };
        if (rememberMe) {
          localStorage.setItem('wp_logged_in_user', JSON.stringify(loggedInUser));
        }
        setIsLoading(false);
        onLoginSuccess(loggedInUser);
      } else {
        setIsLoading(false);
        setErrorMsg('ত্রুটি: প্রবেশ করানো ব্যবহারকারীর নাম বা পাসওয়ার্ড সঠিক নয়।');
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg('লগইন করার সময় একটি ত্রুটি ঘটেছে: ' + (err?.message || 'পুনরায় চেষ্টা করুন'));
    }
  };

  // Handle Registration / Sign Up (ONLY ONE ADMIN ALLOWED EVER)
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // If an admin already exists, strictly prevent any second signup
    if (registeredAdmin) {
      setErrorMsg('অ্যাডমিন ইতিমধ্যেই নিবন্ধিত রয়েছে। দ্বিতীয় কোনো ব্যক্তি নিবন্ধন করতে পারবেন না।');
      setAuthMode('login');
      return;
    }

    const username = regUsername.trim();
    const email = regEmail.trim().toLowerCase();
    const pass = regPassword.trim();
    const fullName = regFullName.trim();

    if (!username || !email || !pass) {
      setErrorMsg('ত্রুটি: অনুগ্রহ করে ব্যবহারকারীর নাম, ইমেইল এবং পাসওয়ার্ড পূরণ করুন।');
      return;
    }

    if (pass.length < 4) {
      setErrorMsg('ত্রুটি: পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।');
      return;
    }

    setIsLoading(true);

    try {
      const newAdminRecord = await registerMasterAdminInDb({
        username,
        email,
        passwordHash: pass,
        fullName: fullName || username,
      });

      setRegisteredAdmin(newAdminRecord);
      localStorage.setItem('wp_master_admin', JSON.stringify(newAdminRecord));

      const loggedInUser = {
        username: newAdminRecord.username,
        email: newAdminRecord.email,
        name: newAdminRecord.fullName,
      };
      localStorage.setItem('wp_logged_in_user', JSON.stringify(loggedInUser));

      setSuccessMsg('অ্যাডমিন অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! ড্যাশবোর্ডে প্রবেশ করানো হচ্ছে...');
      setIsLoading(false);

      setTimeout(() => {
        onLoginSuccess(loggedInUser);
      }, 1000);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg('নিবন্ধনে ত্রুটি: ' + (err?.message || 'পুনরায় চেষ্টা করুন'));
    }
  };

  // Handle Lost Password
  const handleLostPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const input = lostEmail.trim().toLowerCase();
    if (!input) {
      setErrorMsg('ত্রুটি: অনুগ্রহ করে আপনার ইমেইল বা ব্যবহারকারীর নাম লিখুন।');
      return;
    }

    if (
      registeredAdmin &&
      (registeredAdmin.email.toLowerCase() === input || registeredAdmin.username.toLowerCase() === input)
    ) {
      setSuccessMsg(`পাসওয়ার্ড রিকভারি তথ্য আপনার নিবন্ধিত ইমেইলে (${registeredAdmin.email}) পাঠানোর অনুরোধ গ্রহণ করা হয়েছে।`);
      setErrorMsg(null);
    } else {
      setErrorMsg('এই ব্যবহারকারী নাম বা ইমেইল পাওয়া যায়নি।');
    }
  };

  if (isCheckingAdmin) {
    return (
      <div className="min-h-screen bg-[#f0f0f1] text-[#3c434a] font-sans flex flex-col justify-center items-center py-10 px-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <i className="fa fa-spinner fa-spin text-[#2271b1]"></i>
          <span>অ্যাডমিন নিরাপত্তা যাচাই হচ্ছে...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f0f1] text-[#3c434a] font-sans flex flex-col justify-center items-center py-10 px-4 select-none">
      {/* WordPress Official Logo Header */}
      <div className="mb-6 text-center">
        <div
          className="inline-flex items-center justify-center w-20 h-20 bg-[#2271b1] hover:bg-[#135e96] text-white rounded-full shadow-md transition-colors"
          title="WordPress CMS"
        >
          <svg className="w-12 h-12 fill-current" viewBox="0 0 122.5 122.5">
            <path d="M8.7 61.3c0 20.7 12 38.6 29.5 47.1L14.7 41.7c-3.8 6-6 13.1-6 19.6zm73.9-2.3c0-6.4-2.3-10.8-4.3-14.3-2.6-4.3-5.1-8-5.1-12.3 0-4.8 3.6-9.3 8.8-9.3.2 0 .5 0 .7.1-10.4-9.5-24.3-15.3-39.4-15.3-19.1 0-36 9.3-46.5 23.6 1.3 0 2.6.1 3.7.1 6.1 0 15.6-.8 15.6-.8 3.2-.2 3.6 4.5.4 4.8 0 0-3.2.4-6.8.6l21.6 64.3 13-39-9.3-25.3c-3.2-.2-6.3-.6-6.3-.6-3.2-.2-2.8-4.9.4-4.8 0 0 9.7.8 15.4.8 6.1 0 15.6-.8 15.6-.8 3.2-.2 3.6 4.5.4 4.8 0 0-3.2.4-6.8.6l21.4 63.8 5.9-19.8c2.9-9.6 5.1-16.5 5.1-22.4zM62.6 69.4l-17.7 51.5c5.2 1.5 10.7 2.4 16.4 2.4 6.8 0 13.2-1.2 19.2-3.4-.3-.4-.5-.9-.7-1.4L62.6 69.4zm48.7-27.7c.3 2.5.5 5.2.5 8.1 0 8-1.5 17-6 28.3L86.4 133c16.3-9.1 27.4-26.4 27.4-46.4 0-9.4-2.5-18.2-7.5-25.9zM61.3 0C27.4 0 0 27.4 0 61.3s27.4 61.3 61.3 61.3 61.3-27.4 61.3-61.3S95.1 0 61.3 0z" />
          </svg>
        </div>
        <div className="mt-2 text-xs font-semibold text-gray-500 uppercase tracking-widest">
          WordPress CMS &bull; {siteTitle}
        </div>
      </div>

      {/* Main Login / Setup Box */}
      <div className="w-full max-w-[360px] bg-white border border-[#c3c4c7] shadow-sm p-6 rounded-xs">
        {/* Notice for Initial Setup */}
        {!registeredAdmin && authMode === 'register' && (
          <div className="mb-4 p-3 bg-blue-50 border-l-4 border-[#2271b1] text-xs text-[#2c3338] leading-relaxed">
            <p className="font-semibold text-blue-900 mb-0.5">প্রথমবার অ্যাডমিন সেটআপ</p>
            <p>আপনার সাইটের প্রধান অ্যাডমিন একাউন্ট তৈরি করুন। একবার সাইন-আপ সম্পন্ন হলে পরবর্তীতে আর কেউ সাইন-আপ করতে পারবে না।</p>
          </div>
        )}

        {/* Error / Success Notice */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-white border-l-4 border-[#d63638] shadow-xs text-xs text-[#2c3338] leading-relaxed">
            <p>{errorMsg}</p>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-white border-l-4 border-[#00a32a] shadow-xs text-xs text-[#2c3338] leading-relaxed">
            <p>{successMsg}</p>
          </div>
        )}

        {/* 1. LOGIN FORM */}
        {authMode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4 text-[13px]">
            <div>
              <label className="block text-[#2c3338] font-normal mb-1">
                ব্যবহারকারীর নাম বা ইমেইল ঠিকানা
              </label>
              <input
                type="text"
                autoFocus
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
                placeholder="ব্যবহারকারীর নাম / ইমেইল"
                className="w-full bg-[#f6f7f7] border border-[#8c8f94] rounded-xs px-3 py-2 text-[14px] text-[#2c3338] outline-none focus:bg-white focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] transition-all"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[#2c3338] font-normal">
                  পাসওয়ার্ড
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="আপনার গোপন পাসওয়ার্ড"
                  className="w-full bg-[#f6f7f7] border border-[#8c8f94] rounded-xs px-3 py-2 pr-10 text-[14px] text-[#2c3338] outline-none focus:bg-white focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 text-xs px-1 cursor-pointer"
                  tabIndex={-1}
                >
                  <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-1.5 cursor-pointer text-xs text-[#50575e]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#8c8f94] text-[#2271b1] focus:ring-[#2271b1]"
                />
                <span>আমাকে মনে রাখুন</span>
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#2271b1] hover:bg-[#135e96] active:bg-[#0a4b78] text-white font-medium px-4 py-1.5 rounded-xs text-[13px] transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                {isLoading ? (
                  <>
                    <i className="fa fa-spinner fa-spin"></i>
                    <span>যাচাই হচ্ছে...</span>
                  </>
                ) : (
                  <span>লগইন করুন</span>
                )}
              </button>
            </div>
          </form>
        )}

        {/* 2. INITIAL REGISTER FORM (Only available if no admin has registered yet) */}
        {authMode === 'register' && (
          <>
            {registeredAdmin ? (
              <div className="py-2 text-center text-xs text-gray-600">
                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-lg">
                  <i className="fa fa-lock"></i>
                </div>
                <p className="font-semibold text-gray-800 mb-1">নিবন্ধন বন্ধ রয়েছে</p>
                <p className="text-gray-500 mb-3">
                  এই পোর্টালে ইতিমধ্যে প্রধান অ্যাডমিন অ্যাকাউন্ট নিবন্ধিত হয়েছে। দ্বিতীয় কোনো ব্যক্তি সাইন-আপ করতে পারবেন না।
                </p>
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="bg-[#2271b1] text-white text-xs px-4 py-1.5 rounded hover:bg-[#135e96] transition-colors"
                >
                  লগইন পেজে যান
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-3.5 text-[13px]">
                <div>
                  <label className="block text-[#2c3338] font-normal mb-1">
                    ব্যবহারকারীর নাম (Username)
                  </label>
                  <input
                    type="text"
                    autoFocus
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="যেমন: admin বা আপনার নাম"
                    className="w-full bg-[#f6f7f7] border border-[#8c8f94] rounded-xs px-3 py-2 text-[14px] outline-none focus:bg-white focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#2c3338] font-normal mb-1">
                    পুরো নাম (Full Name)
                  </label>
                  <input
                    type="text"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="আপনার পূর্ণ নাম"
                    className="w-full bg-[#f6f7f7] border border-[#8c8f94] rounded-xs px-3 py-2 text-[14px] outline-none focus:bg-white focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1]"
                  />
                </div>

                <div>
                  <label className="block text-[#2c3338] font-normal mb-1">
                    ইমেইল ঠিকানা (Email)
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full bg-[#f6f7f7] border border-[#8c8f94] rounded-xs px-3 py-2 text-[14px] outline-none focus:bg-white focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#2c3338] font-normal mb-1">
                    পাসওয়ার্ড (Password)
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="আপনার গোপন পাসওয়ার্ড দিন"
                    className="w-full bg-[#f6f7f7] border border-[#8c8f94] rounded-xs px-3 py-2 text-[14px] outline-none focus:bg-white focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1]"
                    required
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#2271b1] hover:bg-[#135e96] text-white font-medium py-2 rounded-xs text-[13px] transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {isLoading ? (
                      <>
                        <i className="fa fa-spinner fa-spin"></i>
                        <span>নিবন্ধন সংরক্ষিত হচ্ছে...</span>
                      </>
                    ) : (
                      <span>অ্যাডমিন সাইন-আপ করুন</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </>
        )}

        {/* 3. LOST PASSWORD FORM */}
        {authMode === 'lostpassword' && (
          <form onSubmit={handleLostPassword} className="space-y-4 text-[13px]">
            <p className="text-xs text-[#50575e] leading-relaxed">
              অনুগ্রহ করে আপনার অ্যাডমিন ব্যবহারকারীর নাম বা নিবন্ধিত ইমেইল ঠিকানা লিখুন।
            </p>
            <div>
              <label className="block text-[#2c3338] font-normal mb-1">
                ব্যবহারকারীর নাম বা ইমেইল
              </label>
              <input
                type="text"
                autoFocus
                value={lostEmail}
                onChange={(e) => setLostEmail(e.target.value)}
                className="w-full bg-[#f6f7f7] border border-[#8c8f94] rounded-xs px-3 py-2 text-[14px] outline-none focus:bg-white focus:border-[#2271b1]"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#2271b1] hover:bg-[#135e96] text-white font-medium py-2 rounded-xs text-[13px] transition-colors cursor-pointer"
            >
              পাসওয়ার্ড রিসেট তথ্য পাঠান
            </button>
          </form>
        )}
      </div>

      {/* Footer Navigation Links */}
      <div className="w-full max-w-[360px] mt-4 flex flex-col items-center gap-2 text-xs text-[#2271b1]">
        <div className="flex items-center gap-3">
          {authMode === 'login' ? (
            <>
              {!registeredAdmin && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('register');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="hover:text-[#135e96] hover:underline cursor-pointer"
                  >
                    সাইন আপ (প্রথমবার)
                  </button>
                  <span className="text-gray-400">|</span>
                </>
              )}
              <button
                type="button"
                onClick={() => {
                  setAuthMode('lostpassword');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className="hover:text-[#135e96] hover:underline cursor-pointer"
              >
                পাসওয়ার্ড ভুলে গেছেন?
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className="hover:text-[#135e96] hover:underline cursor-pointer font-medium"
            >
              &larr; লগইন করুন (Log In)
            </button>
          )}
        </div>

        {/* Back to site link */}
        <button
          type="button"
          onClick={onBackToSite}
          className="text-[#646970] hover:text-[#2271b1] hover:underline mt-1 cursor-pointer flex items-center gap-1"
        >
          <span>&larr; {siteTitle} এ ফিরে যান</span>
        </button>
      </div>
    </div>
  );
};
