import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsEmail } from "class-validator";

export class DepartmentCreateDto {
    @ApiProperty({
        description: 'The name of the department',
        example: 'Department of Health',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'The description of the department',
        example: 'The department of health is responsible for the health of the people',
    })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        description: 'The address of the department',
        example: '123 Main St, Anytown, USA',
    })
    @IsString()
    @IsNotEmpty()
    address: string;

    @ApiProperty({
        description: 'The contact email of the department',
        example: 'health@example.com',
    })
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    contact_email: string;

    @ApiProperty({
        description: 'The contact phone of the department',
        example: '+1234567890',
        required: false,
    })
    @IsString()
    @IsOptional()
    contact_phone?: string;

    @ApiProperty({
        description: 'The image url of the department',
        example: 'https://example.com/image.png',
        required: false,
    })
    @IsString()
    @IsOptional()
    image_url?: string;

    @ApiProperty({
        description: 'The clerk organization id of the department (optional, will be created if not provided)',
        example: 'org_1234567890',
        required: false,
    })
    @IsString()
    @IsOptional()
    clerk_org_id?: string;
}