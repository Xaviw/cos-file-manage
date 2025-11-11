import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface Column {
  id: string;
  label: string;
}

interface ColumnManagerProps {
  columns: Column[];
  visibleColumns: string[];
  onColumnToggle: (columnId: string) => void;
}

export function ColumnManager({
  columns,
  visibleColumns,
  onColumnToggle,
}: ColumnManagerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {columns.map((column) => (
        <label
          key={column.id}
          className="flex items-center space-x-2 text-sm"
        >
          <Checkbox
            checked={visibleColumns.includes(column.id)}
            onCheckedChange={() => onColumnToggle(column.id)}
          />
          <span>{column.label}</span>
        </label>
      ))}
    </div>
  );
}
