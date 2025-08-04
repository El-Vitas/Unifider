import React, { useState, useEffect } from 'react';

type BlockSelectorProps = {
  blocks: { id: number; start: string; end: string }[];
  onChange: (selectedMatrix: boolean[]) => void;
  initialSelection?: boolean[];
};

const BlockSelector: React.FC<BlockSelectorProps> = ({
  blocks,
  onChange,
  initialSelection,
}) => {
  const [selectedBlocks, setSelectedBlocks] = useState<boolean[]>(
    initialSelection || Array(blocks.length).fill(true),
  );

  useEffect(() => {
    if (initialSelection) {
      setSelectedBlocks(initialSelection);
    }
  }, [initialSelection]);

  const toggleBlock = (index: number) => {
    const updated = [...selectedBlocks];
    updated[index] = !updated[index];
    setSelectedBlocks(updated);
    onChange(updated);
  };

  return (
    <div className="grid grid-cols-4 gap-2 mt-4">
      {blocks.map((block, index) => (
        <div
          key={block.id}
          onClick={() => toggleBlock(index)}
          className={`p-3 rounded-md text-sm text-center cursor-pointer transition-colors ${
            selectedBlocks[index] ? 'bg-green-400' : 'bg-red-400'
          }`}
        >
          {block.start} - {block.end}
        </div>
      ))}
    </div>
  );
};

export default BlockSelector;
