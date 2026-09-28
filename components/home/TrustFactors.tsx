"use client";

import { useEffect, useState, useRef } from "react";
import { CompanyInfo } from "@/types";

interface TrustFactorsProps {
  companyInfo: CompanyInfo;
}

function CounterNumber({
  target,
  suffix = "",
  inView,
}: {
  target: number;
  suffix?: string;
  inView: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1500;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <div className="text-3xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent drop-shadow-xs">
      {count}
      {suffix}
    </div>
  );
}

export default function TrustFactors({ companyInfo }: TrustFactorsProps) {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const trustFactors = [
    {
      value: companyInfo.yearsExperience,
      suffix: "+",
      title: "Years of Experience",
      description: companyInfo.yearsExperienceDescription,
    },
    {
      value: companyInfo.brandsCount,
      suffix: "+",
      title: "Authorized Brand Partners",
      description: companyInfo.brandsCountDescription,
    },
    {
      value: companyInfo.annualTurnover,
      suffix: "+ Cr",
      title: "Annual Turnover",
      description: companyInfo.annualTurnoverDescription,
    },
    {
      value: companyInfo.employeeCount,
      suffix: "+",
      title: "Trained Experts",
      description: companyInfo.employeeCountDescription,
    },
  ];

  useEffect(() => {
    const currentElem = sectionRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    if (currentElem) observer.observe(currentElem);
    return () => {
      if (currentElem) observer.unobserve(currentElem);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-gradient-to-l from-[#2D415F] to-[#BCC9D6] py-14 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-wide drop-shadow-sm mb-4">
          {companyInfo.trustFactorsHeading}
        </h2>
        <p className="text-gray-100 max-w-2xl mx-auto mb-12 text-sm sm:text-base leading-relaxed">
          {companyInfo.trustFactorsSubheading}
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {trustFactors.map((item, i) => (
            <div
              key={i}
              className="group cursor-pointer rounded-2xl border border-white/20 p-5 sm:p-8 bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:border-red-400"
            >
              <CounterNumber
                target={item.value}
                suffix={item.suffix}
                inView={inView}
              />
              <h3 className="mt-4 text-base sm:text-xl font-bold text-[#2D425C] group-hover:text-red-600 transition-colors duration-300">
                {item.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="h-1 w-24 bg-gradient-to-r from-orange-400 to-red-500 rounded-full mx-auto mt-14" />
      </div>
    </section>
  );
}
