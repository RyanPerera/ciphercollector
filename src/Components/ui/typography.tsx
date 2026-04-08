import React from "react";

interface Props {
  className?: string;
  children: React.ReactNode;
}

const H1: React.FC<Props> = ({ className, children }) => {
  return (
    <h1
      className={`scroll-m-20 text-2xl font-bold tracking-tight lg:text-4xl ${className}`}
    >
      {children}
    </h1>
  );
};

const H2: React.FC<Props> = ({ className, children }) => {
  return (
    <h2
      className={`scroll-m-20 text-secondary text-2xl font-medium tracking-tight ${className}`}
    >
      {children}
    </h2>
  );
};

const H3: React.FC<Props> = ({ className, children }) => {
  return (
    <h3
      className={`scroll-m-20 text-2xl font-semibold tracking-tight ${className}`}
    >
      {children}
    </h3>
  );
};

const H4: React.FC<Props> = ({ className, children }) => {
  return (
    <h4
      className={`scroll-m-20 text-xl font-semibold tracking-tight ${className}`}
    >
      {children}
    </h4>
  );
};

const P: React.FC<Props> = ({ className, children }) => {
  return (
    <p className={`leading-7 text-base text-secondary ${className}`}>
      {children}
    </p>
  );
};

const Blockquote: React.FC<Props> = ({ className, children }) => {
  return (
    <blockquote className={`mt-6 border-l-2 pl-6 italic ${className}`}>
      {children}
    </blockquote>
  );
};

const InlineCode: React.FC<Props> = ({ className, children }) => {
  return (
    <code
      className={`relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold ${className}`}
    >
      {children}
    </code>
  );
};

const Lead: React.FC<Props> = ({ className, children }) => {
  return <p className={`text-xl text-inherit ${className}`}>{children}</p>;
};

const Large: React.FC<Props> = ({ className, children }) => {
  return <div className={`text-lg font-semibold ${className}`}>{children}</div>;
};

const Muted: React.FC<Props> = ({ className, children }) => {
  return <p className={`text-sm ${className}`}>{children}</p>;
};

export { H1, H2, H3, H4, P, Lead, Large, Muted, Blockquote, InlineCode };
