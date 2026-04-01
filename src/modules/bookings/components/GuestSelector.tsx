import React from 'react';
import { useTranslation } from 'react-i18next';
import { Minus, Plus, Users, Baby, PawPrint, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export interface GuestBreakdown {
  adults: number;
  children: number;
  babies: number;
  pets: number;
}

interface GuestSelectorProps {
  value: GuestBreakdown;
  onChange: (value: GuestBreakdown) => void;
  maxGuests: number;
  allowPets?: boolean;
}

const CounterRow: React.FC<{
  icon: React.ElementType;
  label: string;
  subtitle: string;
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
  disableDecrement: boolean;
  disableIncrement: boolean;
}> = ({ icon: Icon, label, subtitle, value, onDecrement, onIncrement, disableDecrement, disableIncrement }) => (
  <div className="flex items-center justify-between py-3">
    <div className="flex items-center gap-3">
      <Icon className="h-5 w-5 text-muted-foreground" />
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={onDecrement}
        disabled={disableDecrement}
      >
        <Minus className="h-3 w-3" />
      </Button>
      <span className="w-6 text-center text-sm font-semibold">{value}</span>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={onIncrement}
        disabled={disableIncrement}
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  </div>
);

export const GuestSelector: React.FC<GuestSelectorProps> = ({
  value,
  onChange,
  maxGuests,
  allowPets = false,
}) => {
  const { t } = useTranslation();
  const totalGuests = value.adults + value.children;
  const atMax = totalGuests >= maxGuests;

  const update = (field: keyof GuestBreakdown, delta: number) => {
    onChange({ ...value, [field]: value[field] + delta });
  };

  const summaryParts: string[] = [];
  if (value.adults > 0) summaryParts.push(`${value.adults} ${t('guests.adults', 'adulte(s)')}`);
  if (value.children > 0) summaryParts.push(`${value.children} ${t('guests.children', 'enfant(s)')}`);
  if (value.babies > 0) summaryParts.push(`${value.babies} ${t('guests.babies', 'bébé(s)')}`);
  if (value.pets > 0) summaryParts.push(`${value.pets} ${t('guests.pets', 'animal(aux)')}`);
  const summary = summaryParts.join(', ') || `1 ${t('guests.adults', 'adulte')}`;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between text-left font-normal h-auto py-2.5"
        >
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{summary}</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 pointer-events-auto" align="start">
        <div className="space-y-1 divide-y divide-border">
          <CounterRow
            icon={User}
            label={t('guests.adultsLabel', 'Adultes')}
            subtitle={t('guests.adultsAge', '13 ans et plus')}
            value={value.adults}
            onDecrement={() => update('adults', -1)}
            onIncrement={() => update('adults', 1)}
            disableDecrement={value.adults <= 1}
            disableIncrement={atMax}
          />
          <CounterRow
            icon={User}
            label={t('guests.childrenLabel', 'Enfants')}
            subtitle={t('guests.childrenAge', '2 à 12 ans')}
            value={value.children}
            onDecrement={() => update('children', -1)}
            onIncrement={() => update('children', 1)}
            disableDecrement={value.children <= 0}
            disableIncrement={atMax}
          />
          <CounterRow
            icon={Baby}
            label={t('guests.babiesLabel', 'Bébés')}
            subtitle={t('guests.babiesAge', 'Moins de 2 ans')}
            value={value.babies}
            onDecrement={() => update('babies', -1)}
            onIncrement={() => update('babies', 1)}
            disableDecrement={value.babies <= 0}
            disableIncrement={value.babies >= 5}
          />
          {allowPets ? (
            <CounterRow
              icon={PawPrint}
              label={t('guests.petsLabel', 'Animaux domestiques')}
              subtitle={t('guests.petsNote', 'Acceptés par l\'hôte')}
              value={value.pets}
              onDecrement={() => update('pets', -1)}
              onIncrement={() => update('pets', 1)}
              disableDecrement={value.pets <= 0}
              disableIncrement={value.pets >= 3}
            />
          ) : (
            <div className="py-3 flex items-center gap-3 opacity-50">
              <PawPrint className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{t('guests.petsLabel', 'Animaux domestiques')}</p>
                <p className="text-xs text-muted-foreground">{t('guests.petsNotAllowed', 'Non acceptés')}</p>
              </div>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          {t('guests.maxNote', 'Maximum {{max}} voyageurs (hors bébés)', { max: maxGuests })}
        </p>
      </PopoverContent>
    </Popover>
  );
};
