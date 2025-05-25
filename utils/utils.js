import { useRef, useEffect } from "react";

export function getSectionListData(data) {
  const structure = [];

  data.forEach(item => {
    const categoryName = item.category.charAt(0).toUpperCase() + item.category.slice(1);
    const existing = structure.find(section => section.name === categoryName);

    const entry = {
      id: item.id,
      name: item.name,
      price: item.price,
      description: item.description,
      image: item.image,
    };

    if (existing) {
      existing.data.push(entry);
    } else {
      structure.push({
        name: categoryName,
        data: [entry],
      });
    }
  });

  return structure;
}

export function useUpdateEffect(effect, dependencies = []) {
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      return effect();
    }
  }, dependencies);
}
