import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class DepartmentCreateDto {
    @ApiProperty({
        description: 'The name of the department',
        example: 'Department of Health',
    })
    @IsString()
    @IsOptional()
    name: string;

    @ApiProperty({
        description: 'The description of the department',
        example: 'The department of health is responsible for the health of the people',
    })
    @IsString()
    @IsOptional()
    description: string;

    @ApiProperty({
        description: 'The address of the department',
        example: '123 Main St, Anytown, USA',
    })
    address: string;

    @ApiProperty({
        description: 'The contact email of the department',
        example: 'health@example.com',
    })
    @IsString()
    @IsOptional()
    contact_email: string;

    @ApiProperty({
        description: 'The contact phone of the department',
        example: '+1234567890',
    })
    contact_phone?: string;

    @ApiProperty({
        description: 'The image url of the department',
        example: 'https://example.com/image.png',
    })
    @IsString()
    @IsOptional()
    image_url?: string;

    @ApiProperty({
        description: 'The clerk organization id of the department',
        example: 'org_1234567890',
    })
    @IsString()
    @IsOptional()
    clerk_org_id?: string;
}