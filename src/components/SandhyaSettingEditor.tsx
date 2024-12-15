import { Sheet, List, ListItem, Navbar } from "konsta/react";

interface SettingOption {
  value: string | number;
  label: string;
}

interface SandhyaSettingEditorProps {
  opened: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  options: SettingOption[];
  value: string | number;
  onSelect: (value: string | number) => void;
}

function SandhyaSettingEditor({ 
  opened, 
  onClose, 
  title, 
  subtitle, 
  options, 
  value, 
  onSelect 
}: SandhyaSettingEditorProps) {
  return (
    <Sheet
      className="pb-safe !w-[calc(100%-16px)] mx-2 rounded-t-xl"
      opened={opened}
      onBackdropClick={onClose}
    >
      <Navbar
        centerTitle
        title={title}
        subtitle={subtitle}
      />

      <List nested dividers outline>
        {options.map((option) => (
          <ListItem
            key={option.value}
            title={option.label}
            onClick={() => {
              onSelect(option.value);
              onClose();
            }}
            after={value === option.value ? "✓" : undefined}
          />
        ))}
      </List>
    </Sheet>
  );
}

export default SandhyaSettingEditor; 