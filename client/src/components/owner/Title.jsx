const Title = ({ title, subTitle }) => {
  return (
    <div className="!mb-2">
      <h1 className="font-semibold text-2xl md:text-3xl text-gray-800">
        {title}
      </h1>
      <p className="text-sm md:text-base text-gray-500/90 !mt-2 max-w-xl leading-relaxed">
        {subTitle}
      </p>
    </div>
  );
};

export default Title;
