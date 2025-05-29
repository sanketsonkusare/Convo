const shapes = [
  "circle", "square", "circle",
  "square", "circle", "square",
  "circle", "square", "circle",
];

const Shape = ({ type, className }) => {
  if (type === "circle") {
    return <div className={`aspect-square rounded-full bg-primary/10 ${className}`} />;
  }
  if (type === "square") {
    return <div className={`aspect-square rounded-2xl bg-primary/10 ${className}`} />;
  }
  return null;
};

const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
      <div className="max-w-md text-center">
        <div className="grid grid-cols-3 gap-3 mb-8">
          {shapes.map((shape, i) => (
            <Shape
              key={i}
              type={shape}
              className={i % 2 === 0 ? "animate-pulse" : ""}
            />
          ))}
        </div>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-base-content/60">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;