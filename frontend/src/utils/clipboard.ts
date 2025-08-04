import toast from "react-hot-toast";

/**
 * Copy text to clipboard with user feedback
 */
export const copyToClipboard = async (text: string, successMessage?: string): Promise<boolean> => {
    try {
        await navigator.clipboard.writeText(text);
        toast.success(successMessage || "Copied to clipboard!");
        return true;
    } catch (error) {
        console.error("Failed to copy to clipboard:", error);
        toast.error("Failed to copy to clipboard");
        return false;
    }
};

/**
 * Share content using Web Share API or fallback to clipboard
 */
export const shareContent = async (content: {
    title?: string;
    text: string;
    url?: string;
}): Promise<boolean> => {
    try {
        if (navigator.share && navigator.canShare && navigator.canShare(content)) {
            await navigator.share(content);
            return true;
        } else {
            // Fallback to clipboard
            const success = await copyToClipboard(content.text, "Content copied to clipboard for sharing!");
            return success;
        }
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            // User cancelled the share, don't show error
            return false;
        }
        console.error("Error sharing content:", error);
        toast.error("Failed to share content");
        return false;
    }
};
