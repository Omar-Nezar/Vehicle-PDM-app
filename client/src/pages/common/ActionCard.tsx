import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingButton from "src/pages/common/LoadingButton";

interface ActionCardProps {
    title: string;
    description: string;
    buttonText: string;
    loadingText: string;
    loading: boolean;
    onClick: () => void;
    icon?: React.ReactNode;
}

export function ActionCard({
    title,
    description,
    buttonText,
    loadingText,
    loading,
    onClick,
    icon,
}: ActionCardProps) {
    return (
        <Card className="max-w-md">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>

            <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                    {description}
                </p>

                <LoadingButton
                    type="button"
                    className="w-full"
                    loading={loading}
                    loadingChildren={loadingText}
                    onClick={onClick}
                >
                    {icon}
                    {buttonText}
                </LoadingButton>
            </CardContent>
        </Card>
    );
}