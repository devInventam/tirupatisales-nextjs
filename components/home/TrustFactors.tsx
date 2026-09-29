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
    <div className="text-3xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow-sm">
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
      value: companyInfo.yearsExperience || 30,
      suffix: "+",
      title: "Years of Experience",
      description: companyInfo.yearsExperienceDescription || "Supplying to infrastructure, industries, and government projects.",
    },
    {
      value: companyInfo.brandsCount || 36,
      suffix: "+",
      title: "Authorized Brand Partners",
      description: companyInfo.brandsCountDescription || "Working with 30+ global electrical brands.",
    },
    {
      value: companyInfo.annualTurnover || 650,
      suffix: "+ Cr",
      title: "Turnover",
      description: companyInfo.annualTurnoverDescription || "Trusted by leading builders, infrastructure firms, and top corporates.",
    },
    {
      value: companyInfo.employeeCount || 200,
      suffix: "+",
      title: "Trained Experts",
      description: companyInfo.employeeCountDescription || "Staff with deep technical know-how and support beyond sales.",
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
      className="bg-gradient-to-l from-[#2D415F] to-[#BCC9D6] py-8 px-4"
    >
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-white tracking-wide drop-shadow mb-6">
          {companyInfo.trustFactorsHeading || "Powering Businesses with Trusted Electrical Solutions"}
        </h2>
        <p className="text-gray-200 max-w-2xl mx-auto mb-12 leading-relaxed">
          {companyInfo.trustFactorsSubheading || "Our legacy, scale, and service make us a dependable partner across industries."}
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
          {trustFactors.map((item, i) => (
            <li
              key={i}
              className="group cursor-pointer list-none rounded-xl sm:rounded-2xl border border-transparent py-4 sm:py-8 px-2 bg-white shadow-md hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 hover:border-red-400"
            >
              <CounterNumber
                target={item.value}
                suffix={item.suffix}
                inView={inView}
              />
              <h3 className="mt-3 sm:mt-5 text-sm sm:text-xl font-bold text-[#2D425C] group-hover:text-red-600 transition-colors duration-300">
                {item.title}
              </h3>
              <p className="mt-2 sm:mt-3 text-xs sm:text-base text-gray-600 leading-tight sm:leading-[1.2]">
                {item.description}
              </p>
            </li>
          ))}
        </div>

        <div className="h-1 w-24 bg-gradient-to-r from-orange-400 to-red-500 rounded-full mx-auto mt-16 origin-left" />
      </div>
    </section>
  );
}
