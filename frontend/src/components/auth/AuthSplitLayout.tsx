"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

type AuthSplitLayoutProps = {
    mode: "login" | "register";
    title: string;
    subtitle: string;
    children: ReactNode;
};

const shellTransition = {
    duration: 0.72,
    ease: [0.22, 1, 0.36, 1] as const,
};

const fadeUp = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0 },
};

export default function AuthSplitLayout({
    mode,
    title,
    subtitle,
    children,
}: AuthSplitLayoutProps) {
    const isLogin = mode === "login";

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#efe9df]">
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-[1.04]"
                style={{ backgroundImage: "url('/auth/auth-bg.jpg')" }}
            />

            <div className="absolute inset-0 bg-[rgba(32,25,18,0.30)]" />

            <div className="absolute inset-0 backdrop-blur-[7px]" />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.20),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_24%)]" />

            <section className="relative z-10 mx-auto flex min-h-screen w-full items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
                <div className="grid min-h-[760px] w-full max-w-[1380px] overflow-hidden rounded-[38px] border border-white/20 bg-white/10 shadow-[0_35px_100px_rgba(0,0,0,0.18)] backdrop-blur-xl lg:grid-cols-[0.96fr_1.24fr]">
                    <div
                        className={[
                            "relative hidden overflow-hidden lg:block",
                            isLogin ? "order-1" : "order-2",
                        ].join(" ")}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={mode}
                                initial={{
                                    x: isLogin ? -36 : 36,
                                    opacity: 0,
                                    scale: 1.02,
                                }}
                                animate={{
                                    x: 0,
                                    opacity: 1,
                                    scale: 1,
                                }}
                                exit={{
                                    x: isLogin ? 28 : -28,
                                    opacity: 0,
                                    scale: 1.01,
                                }}
                                transition={shellTransition}
                                className="absolute inset-0"
                            >
                                <div className="relative h-full w-full">
                                    <img
                                        src={
                                            isLogin
                                                ? "/auth/login.jpg"
                                                : "/auth/login1.jpg"
                                        }
                                        alt={
                                            isLogin
                                                ? "Blue Peach login visual"
                                                : "Blue Peach register visual"
                                        }
                                        className="h-full w-full object-cover"
                                    />

                                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,16,16,0.14)_0%,rgba(16,16,16,0.34)_45%,rgba(16,16,16,0.74)_100%)]" />
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_24%)]" />

                                    <motion.div
                                        initial={{ opacity: 0, y: -12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.12, duration: 0.55 }}
                                        className="absolute left-8 right-8 top-8 z-10"
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <Link
                                                href="/"
                                                className="inline-flex items-center text-[20px] font-semibold tracking-[0.18em] text-white drop-shadow"
                                            >
                                                BLUE PEACH
                                            </Link>

                                            <Link
                                                href="/"
                                                className="inline-flex items-center rounded-full border border-white/18 bg-white/8 px-4 py-2 text-[12px] font-semibold tracking-[0.12em] text-white/92 backdrop-blur-md transition hover:bg-white/14"
                                            >
                                                Về trang chủ
                                            </Link>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 28 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.18, duration: 0.62, ease: "easeOut" }}
                                        className="absolute inset-x-8 bottom-8 z-10 rounded-[30px] border border-white/18 bg-white/10 p-6 text-white backdrop-blur-xl shadow-[0_18px_40px_rgba(0,0,0,0.18)]"
                                    >
                                        <motion.p
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.24, duration: 0.45 }}
                                            className="mb-4 text-[13px] uppercase tracking-[0.24em] text-white/70"
                                        >
                                            {isLogin ? "Khách hàng quay lại" : "Khách hàng mới"}
                                        </motion.p>

                                        <motion.h2
                                            initial={{ opacity: 0, y: 14 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.28, duration: 0.52 }}
                                            className="font-heading text-4xl leading-[1.08] md:text-5xl"
                                        >
                                            {isLogin
                                                ? "Chào mừng bạn quay lại."
                                                : "Đăng ký tài khoản Blue Peach"}
                                        </motion.h2>

                                        <motion.p
                                            initial={{ opacity: 0, y: 14 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.34, duration: 0.52 }}
                                            className="mt-4 max-w-[460px] text-[15px] leading-8 text-white/82"
                                        >
                                            {isLogin
                                                ? "Đăng nhập để tiếp tục hành trình mua sắm trang sức bạc với trải nghiệm cá nhân hóa, thanh lịch và liền mạch."
                                                : "Đăng ký để lưu địa chỉ giao hàng, theo dõi đơn hàng và sẵn sàng cho các tính năng tài khoản ở các giai đoạn tiếp theo."}
                                        </motion.p>

                                        <motion.div
                                            initial={{ opacity: 0, y: 16 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.42, duration: 0.52 }}
                                            className="mt-8 border-t border-white/15 pt-5"
                                        >
                                            <p className="text-sm text-white/65">
                                                {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}
                                            </p>
                                            <Link
                                                href={isLogin ? "/register" : "/login"}
                                                className="mt-2 inline-flex items-center text-base font-semibold text-white underline decoration-white/35 underline-offset-4 transition hover:decoration-white"
                                            >
                                                {isLogin ? "Tạo tài khoản mới" : "Đăng nhập"}
                                            </Link>
                                        </motion.div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div
                        className={[
                            "flex items-center justify-center px-5 py-10 sm:px-8 lg:px-10",
                            isLogin ? "order-2" : "order-1",
                        ].join(" ")}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`${mode}-form-shell`}
                                initial={{
                                    x: isLogin ? 42 : -42,
                                    opacity: 0,
                                }}
                                animate={{
                                    x: 0,
                                    opacity: 1,
                                }}
                                exit={{
                                    x: isLogin ? -26 : 26,
                                    opacity: 0,
                                }}
                                transition={shellTransition}
                                className="w-full max-w-[560px]"
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 20, scale: 0.992 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{
                                        delay: 0.08,
                                        duration: 0.52,
                                        ease: [0.22, 1, 0.36, 1],
                                    }}
                                    className="relative rounded-[34px] border border-white/35 bg-[rgba(255,255,255,0.70)] px-6 py-8 shadow-[0_22px_70px_rgba(0,0,0,0.14)] backdrop-blur-2xl sm:px-8 sm:py-10"
                                >
                                    <div className="pointer-events-none absolute inset-0 rounded-[34px] ring-1 ring-white/30" />
                                    <div className="pointer-events-none absolute -inset-px rounded-[34px] bg-[linear-gradient(180deg,rgba(255,255,255,0.32),rgba(255,255,255,0.02))] opacity-60" />

                                    <motion.div
                                        initial="hidden"
                                        animate="show"
                                        variants={{
                                            hidden: {},
                                            show: {
                                                transition: {
                                                    staggerChildren: 0.06,
                                                    delayChildren: 0.08,
                                                },
                                            },
                                        }}
                                        className="relative z-10 mb-8 text-center"
                                    >
                                        <motion.p
                                            variants={fadeUp}
                                            className="mb-3 text-[12px] font-semibold uppercase tracking-[0.24em] text-black/45"
                                        >
                                            Blue Peach Account
                                        </motion.p>

                                        <motion.h1
                                            variants={fadeUp}
                                            className="font-heading text-4xl leading-tight text-[#161616] md:text-5xl"
                                        >
                                            {title}
                                        </motion.h1>

                                        <motion.p
                                            variants={fadeUp}
                                            className="mx-auto mt-3 max-w-[460px] text-sm leading-7 text-black/60"
                                        >
                                            {subtitle}
                                        </motion.p>
                                    </motion.div>

                                    <motion.div
                                        key={`${mode}-children`}
                                        initial={{ opacity: 0, y: 18 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2, duration: 0.45 }}
                                        className="relative z-10"
                                    >
                                        {children}
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 14 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.28, duration: 0.45 }}
                                        className="relative z-10 mt-6 text-center text-sm text-black/58 lg:hidden"
                                    >
                                        {isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
                                        <Link
                                            href={isLogin ? "/register" : "/login"}
                                            className="bp-link font-semibold text-black"
                                        >
                                            {isLogin ? "Tạo tài khoản" : "Đăng nhập"}
                                        </Link>
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </section>
        </main>
    );
}