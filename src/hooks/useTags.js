import { useState } from "react";

/**
 * Custom hook to manage tags for artifact upload.
 * Handles adding, removing, and resetting tags.
 */
export default function useTags() {
  const [tags, setTags] = useState([]);

  /**
   * Add a new tag if it’s not empty or duplicate.
   */
  const addTag = (tag) => {
    const cleanTag = tag.trim();

    if (!cleanTag) return; // ignore empty tags
    if (tags.includes(cleanTag)) return; // avoid duplicates

    setTags((prev) => [...prev, cleanTag]);
  };

  /**
   * Remove tag from list.
   */
  const removeTag = (tagToRemove) => {
    setTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  /**
   * Reset all tags (useful after successful upload or closing modal).
   */
  const resetTags = () => {
    setTags([]);
  };

  return {
    tags,
    addTag,
    removeTag,
    resetTags,
  };
}