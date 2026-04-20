import { countries } from '../lib/countries';

interface CountryFlagProps {
  countryName: string;
  className?: string;
  size?: number;
}

/**
 * Renders a country flag image via flagcdn.com using the ISO country code.
 * This works cross-platform including Windows where flag emojis are not rendered.
 */
export const CountryFlag = ({ countryName, className = '', size = 20 }: CountryFlagProps) => {
  const country = countries.find(c => c.name === countryName);
  if (!country) return null;

  const code = country.code.toLowerCase();

  return (
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      srcSet={`https://flagcdn.com/w80/${code}.png 2x`}
      width={size}
      height={size}
      alt={countryName}
      className={`inline-block object-cover rounded-sm ${className}`}
      style={{ aspectRatio: '4/3', objectFit: 'cover' }}
    />
  );
};
