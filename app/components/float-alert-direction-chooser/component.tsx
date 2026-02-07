interface FloatAlertDirectionChooserProps {
  className?: string;
  type?: 'destination' | 'origin';
}

const FloatAlertDirectionChooser = ({ className, type }: FloatAlertDirectionChooserProps) => {
  const getDistination = () => {
    if (!type) return 'something';

    return type;
  };

  return (
    <div
      style={{ position: 'absolute', zIndex: 900, width: '100%', backgroundColor: '#2BCBBA', color: 'white' }}
      className={`${className} text-center`}
    >
      <p className="text-center p-1">Pin or tap your {getDistination()} from the map.</p>
    </div>
  );
};

export default FloatAlertDirectionChooser;
