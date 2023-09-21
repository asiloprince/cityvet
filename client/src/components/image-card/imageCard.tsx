interface ImageCardProps {
  id?: string;
  className?: string;
  imageLink: string;
  onClick?: () => void;
  title?: string;
  description?: string;
}

export default function ImageCard(props: ImageCardProps) {
  const { id, className, imageLink, onClick, title, description } = props;

  if (!title && !description) {
    throw new Error(
      "Title and/or description property values must be provided"
    );
  }

  return (
    <div
      id={id}
      onClick={onClick}
      className={`bg-white inline-block overflow-hidden rounded-md shadow-md transition-transform ${
        className ? className : ""
      } ${onClick ? "cursor-pointer" : ""} hover:text-gray-600`}
    >
      <div className="h-48 overflow-hidden hover:scale-110 hover:outline-slate-5">
        <img
          src={imageLink}
          alt={title}
          className="w-full h-full object-cover transform transition-transform duration-200 hover:scale-110"
        />
      </div>
      <div className="p-4 flex flex-col">
        {title && <h1 className="font-semibold text-xl">{title}</h1>}
        {description && <p className="text-slate-7">{description}</p>}
      </div>
    </div>
  );
}
