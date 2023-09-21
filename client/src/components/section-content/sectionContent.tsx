interface SectionContentProps {
  className?: string;
  children: React.ReactNode;
}

export default function SectionContent(props: SectionContentProps) {
  const { className, children } = props;

  return (
    <section className={`py-12 ${className}`}>
      <div className="container mx-auto">{children}</div>
    </section>
  );
}

// Define the prop type for SectionTitle component
interface SectionTitleProps {
  className?: string;
  children: React.ReactNode;
}

export function SectionTitle(props: SectionTitleProps) {
  const { className, children } = props;

  if (!children) {
    throw new Error(
      "Title and/or description are required. H1 for title and P tag for description."
    );
  }

  return (
    <div className={`mb-10 ${className}`}>
      <div className="text-center lg:max-w-600 lg:mx-auto">{children}</div>
    </div>
  );
}

interface SectionWrapperProps {
  className?: string;
  children: React.ReactNode;
}

export function SectionWrapper(props: SectionWrapperProps) {
  const { className, children } = props;

  if (!children) {
    throw new Error("Content is required.");
  }

  return <div className={`${className}`}>{children}</div>;
}
