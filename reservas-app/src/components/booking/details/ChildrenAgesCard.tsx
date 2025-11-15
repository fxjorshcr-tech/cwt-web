// src/components/booking/details/ChildrenAgesCard.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ValidationErrors } from '@/utils/bookingValidation';

interface ChildrenAgesCardProps {
  childrenCount: number;
  childrenAges: (number | null)[];
  errors: ValidationErrors;
  onChildrenAgesChange: (ages: (number | null)[]) => void;
}

export function ChildrenAgesCard({
  childrenCount,
  childrenAges,
  errors,
  onChildrenAgesChange,
}: ChildrenAgesCardProps) {
  if (childrenCount === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base md:text-lg">Children&apos;s Ages</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Age of each child (0-12 years) <span className="text-red-500">*</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Array.from({ length: childrenCount }, (_, idx) => (
            <div key={idx}>
              <Label htmlFor={`child_age_${idx}`} className="text-sm">
                Child {idx + 1}
              </Label>
              <select
                id={`child_age_${idx}`}
                value={childrenAges[idx] ?? ''}
                onChange={(e) => {
                  const newAges = [...childrenAges];
                  newAges[idx] = e.target.value ? parseInt(e.target.value) : null;
                  onChildrenAgesChange(newAges);
                }}
                className="w-full h-10 px-3 rounded-md border border-input bg-transparent text-sm"
              >
                <option value="">Select</option>
                {Array.from({ length: 13 }, (_, i) => i).map((age) => (
                  <option key={age} value={age}>
                    {age} yr{age !== 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
        {errors.children_ages && (
          <p className="text-xs text-red-600 mt-2">{errors.children_ages}</p>
        )}
      </CardContent>
    </Card>
  );
}
