import React, { memo, useState, useCallback } from 'react';
import { ErrorBoundary } from '@/modules/shared/components/ErrorBoundary';
import { DynamicCombobox, ComboboxOption } from '@/modules/shared/components/DynamicCombobox';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Apple, Cherry, Grape, Citrus, Banana, Bean, Carrot, Leaf } from 'lucide-react';

const fruits: ComboboxOption[] = [
  { value: 'apple', label: 'Apple', icon: <Apple className="h-4 w-4" />, description: 'A crisp red fruit' },
  { value: 'cherry', label: 'Cherry', icon: <Cherry className="h-4 w-4" />, description: 'Small and sweet' },
  { value: 'grape', label: 'Grape', icon: <Grape className="h-4 w-4" />, description: 'Grows in clusters' },
  { value: 'orange', label: 'Orange', icon: <Citrus className="h-4 w-4" />, description: 'Citrus and tangy' },
  { value: 'banana', label: 'Banana', icon: <Banana className="h-4 w-4" />, description: 'Rich in potassium' },
];

const groupedItems: ComboboxOption[] = [
  { value: 'apple', label: 'Apple', group: 'Fruits' },
  { value: 'cherry', label: 'Cherry', group: 'Fruits' },
  { value: 'grape', label: 'Grape', group: 'Fruits' },
  { value: 'carrot', label: 'Carrot', group: 'Vegetables', icon: <Carrot className="h-4 w-4" /> },
  { value: 'bean', label: 'Bean', group: 'Vegetables', icon: <Bean className="h-4 w-4" /> },
  { value: 'spinach', label: 'Spinach', group: 'Vegetables', icon: <Leaf className="h-4 w-4" /> },
  { value: 'disabled-item', label: 'Out of Stock', group: 'Vegetables', disabled: true },
];

export const ComboboxDemo = memo(() => {
  const [single, setSingle] = useState<string>('');
  const [multi, setMulti] = useState<string[]>([]);
  const [grouped, setGrouped] = useState<string>('');
  const [creatable, setCreatable] = useState<string[]>([]);
  const [creatableOptions, setCreatableOptions] = useState<ComboboxOption[]>(fruits);

  const handleSingleSelect = useCallback((val: string) => setSingle(val), []);
  const handleSingleClear = useCallback(() => setSingle(''), []);

  const handleMultiSelect = useCallback((val: string) => {
    setMulti(prev => [...prev, val]);
  }, []);
  const handleMultiDeselect = useCallback((val: string) => {
    setMulti(prev => prev.filter(v => v !== val));
  }, []);
  const handleMultiClear = useCallback(() => setMulti([]), []);

  const handleGroupedSelect = useCallback((val: string) => setGrouped(val), []);
  const handleGroupedClear = useCallback(() => setGrouped(''), []);

  const handleCreatableSelect = useCallback((val: string) => {
    setCreatable(prev => prev.includes(val) ? prev : [...prev, val]);
  }, []);
  const handleCreatableDeselect = useCallback((val: string) => {
    setCreatable(prev => prev.filter(v => v !== val));
  }, []);
  const handleCreate = useCallback((val: string) => {
    const newOpt: ComboboxOption = { value: val.toLowerCase(), label: val };
    setCreatableOptions(prev => [...prev, newOpt]);
    setCreatable(prev => [...prev, val.toLowerCase()]);
  }, []);
  const handleCreatableClear = useCallback(() => setCreatable([]), []);

  return (
    <ErrorBoundary>
      <div className="space-y-8 p-6 max-w-5xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-foreground">DynamicCombobox Demo</h1>
          <p className="text-muted-foreground mt-1">Searchable dropdown with all prop variations</p>
        </div>

        {/* Single Select */}
        <Card>
          <CardHeader>
            <CardTitle>Single Select</CardTitle>
            <CardDescription>Basic single selection with icons and descriptions. Selected: <Badge variant="outline">{single || 'none'}</Badge></CardDescription>
          </CardHeader>
          <CardContent className="max-w-sm">
            <DynamicCombobox
              options={fruits}
              value={single}
              placeholder="Pick a fruit..."
              searchPlaceholder="Search fruits..."
              onSelect={handleSingleSelect}
              onClear={handleSingleClear}
            />
          </CardContent>
        </Card>

        {/* Multi Select */}
        <Card>
          <CardHeader>
            <CardTitle>Multi Select</CardTitle>
            <CardDescription>Select multiple items with max 3 selections. Selected: {multi.length}/3</CardDescription>
          </CardHeader>
          <CardContent className="max-w-md">
            <DynamicCombobox
              options={fruits}
              value={multi}
              multiSelect
              maxSelections={3}
              placeholder="Pick up to 3 fruits..."
              onSelect={handleMultiSelect}
              onDeselect={handleMultiDeselect}
              onClear={handleMultiClear}
            />
          </CardContent>
        </Card>

        {/* Grouped */}
        <Card>
          <CardHeader>
            <CardTitle>Grouped Options</CardTitle>
            <CardDescription>Options organized by category with a disabled item. Selected: <Badge variant="outline">{grouped || 'none'}</Badge></CardDescription>
          </CardHeader>
          <CardContent className="max-w-sm">
            <DynamicCombobox
              options={groupedItems}
              value={grouped}
              grouped
              placeholder="Select an item..."
              onSelect={handleGroupedSelect}
              onClear={handleGroupedClear}
            />
          </CardContent>
        </Card>

        {/* Sizes */}
        <Card>
          <CardHeader><CardTitle>Sizes</CardTitle><CardDescription>Small, medium, and large combobox</CardDescription></CardHeader>
          <CardContent className="space-y-4 max-w-sm">
            {(['sm', 'md', 'lg'] as const).map(size => (
              <div key={size}>
                <Badge variant="outline" className="mb-1">{size}</Badge>
                <DynamicCombobox options={fruits.slice(0, 3)} size={size} placeholder={`Size ${size}`} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Creatable */}
        <Card>
          <CardHeader>
            <CardTitle>Creatable Multi-Select</CardTitle>
            <CardDescription>Type a new value and create it on the fly. Items: {creatable.length}</CardDescription>
          </CardHeader>
          <CardContent className="max-w-md">
            <DynamicCombobox
              options={creatableOptions}
              value={creatable}
              multiSelect
              creatable
              placeholder="Search or create..."
              onSelect={handleCreatableSelect}
              onDeselect={handleCreatableDeselect}
              onCreate={handleCreate}
              onClear={handleCreatableClear}
            />
          </CardContent>
        </Card>

        {/* Custom Render */}
        <Card>
          <CardHeader><CardTitle>Custom Value Render</CardTitle><CardDescription>Custom display for selected values</CardDescription></CardHeader>
          <CardContent className="max-w-sm">
            <DynamicCombobox
              options={fruits}
              value={single}
              onSelect={handleSingleSelect}
              onClear={handleSingleClear}
              renderValue={(selected) =>
                selected.length > 0
                  ? <span className="flex items-center gap-2 text-primary font-medium">{selected[0].icon} ✨ {selected[0].label}</span>
                  : <span className="text-muted-foreground">Custom render...</span>
              }
            />
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
});

ComboboxDemo.displayName = 'ComboboxDemo';
