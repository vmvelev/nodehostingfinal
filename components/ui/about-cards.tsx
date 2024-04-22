interface AboutCardsProps {
  name: string;
  body: string;
}

export const AboutCards: React.FC<AboutCardsProps> = ({ name, body }) => {
  return (
    <div className="grid gap-1">
      <h3 className="text-xl font-bold">{name}</h3>
      <p className="text-sm text-gray-300">{body}</p>
    </div>
  );
};
