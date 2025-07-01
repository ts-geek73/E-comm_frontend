"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IBasicFormType } from "@/types/stock"
import { memo } from "react"

const BasicInfoCard: React.FC<{
    formData: IBasicFormType
    onSave: (formData: IBasicFormType) => void
}> = ({ formData, onSave }) => {
    const handleInputChange = (field: keyof IBasicFormType, value: string) => {
        onSave({
            ...formData,
            [field]: value,
        })
    }


    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="stock_name">Stock Entry Name *</Label>
                        <Input
                            id="stock_name"
                            value={formData.stock_name}
                            onChange={(e) => handleInputChange("stock_name", e.target.value)}
                            placeholder="Enter stock entry name"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        placeholder="Optional description"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="added_by">Added By</Label>
                    <Input
                        id="added_by"
                        readOnly
                        value={formData.added_by}
                        onChange={(e) => handleInputChange("added_by", e.target.value)}
                        placeholder="User email"
                    />
                </div>
            </CardContent>
        </Card>
    );
}

export default memo(BasicInfoCard);