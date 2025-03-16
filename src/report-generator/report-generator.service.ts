import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PDFDocument, PDFPage, rgb } from 'pdf-lib';
import { Job } from '../job/schemas/job.schema';
// import { readFile, writeFile } from 'fs/promises';
import * as moment from 'moment';
import * as QRCode from 'qrcode';
import { pdfBuffer } from './pdf-template-buffer-3';
import { buffer as logoBuffer } from './comtechLogoBuffer'
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import * as fs from 'fs';

@Injectable()
export class ReportGeneratorService {

    constructor(@InjectModel(Job.name) private readonly jobModel: Model<Job>) {}

    async generateQRCode(data: string): Promise<string> {
        try {
            const qrCode = await QRCode.toDataURL(data);
            return qrCode;
        } catch (error) {
            console.error('Error generating QR code:', error);
            throw error;
        }
    }

    async generateJobOrderSlip(data: any): Promise<Buffer> {
        try {
            const {
                _id,
                customerId,
                jobOrderNum,
                trackingCode,
                jobDate,
                unitModel,
                unitSpecs,
                unitAccessories,
                workPerformed,
                sCharge,
                sPayMeth,
                sDownPayment,
                sBalance,
                sStatus,
                sUnitDropOff,
                sRelDate
            } = data;

            const pdfDoc = await PDFDocument.load(pdfBuffer);
            const fieldNames = pdfDoc
                .getForm()
                .getFields()
                .map((f) => f.getName());
            const [page] = pdfDoc.getPages();

            const form = pdfDoc.getForm();

            // set data to form
            form.getTextField('jobOrderNum').setText(
                jobOrderNum == null ? '' : jobOrderNum.toString().toUpperCase(),
            );
            form.getTextField('jobOrderNum_2').setText(
                jobOrderNum == null ? '' : jobOrderNum.toString().toUpperCase(),
            );
            form.getTextField('trackingCode').setText(
                trackingCode == null ? '' : trackingCode.toString().toUpperCase(),
            )
            form.getTextField('trackingCode_2').setText(
                trackingCode == null ? '' : trackingCode.toString().toUpperCase(),
            )
            form.getTextField('cusName').setText(
                customerId.cusName == null ? '' : customerId.cusName.toString().toUpperCase(),
            );
            form.getTextField('cusName_2').setText(
                customerId.cusName == null ? '' : customerId.cusName.toString().toUpperCase(),
            );
            form.getTextField('cusAddress').setText(
                customerId.cusAddress == null ? '' : customerId.cusAddress.toString().toUpperCase(),
            );
            form.getTextField('cusAddress_2').setText(
                customerId.cusAddress == null ? '' : customerId.cusAddress.toString().toUpperCase(),
            );
            form.getTextField('cusPhones').setText(
                customerId.cusPhones == null ? '' : customerId.cusPhones.join(', ').toUpperCase(),
            );
            form.getTextField('cusPhones_2').setText(
                customerId.cusPhones == null ? '' : customerId.cusPhones.join(', ').toUpperCase(),
            );
            form.getTextField('jobDate').setText(
                jobDate == null ? '' : moment(jobDate).format('MMM DD, YYYY').toUpperCase(),
            );
            form.getTextField('jobDate_2').setText(
                jobDate == null ? '' : moment(jobDate).format('MMM DD, YYYY').toUpperCase(),
            );
            form.getTextField('unitModel').setText(
                unitModel == null ? '' : unitModel.toString().toUpperCase(),
            );
            form.getTextField('unitModel_2').setText(
                unitModel == null ? '' : unitModel.toString().toUpperCase(),
            );
            form.getTextField('unitSpecs').setText(
                unitSpecs == null ? '' : unitSpecs.toString().toUpperCase(),
            );
            form.getTextField('unitSpecs_2').setText(
                unitSpecs == null ? '' : unitSpecs.toString().toUpperCase(),
            );
            form.getTextField('unitAccessories').setText(
                unitAccessories == null ? '' : unitAccessories.toString().toUpperCase(),
            );
            form.getTextField('unitAccessories_2').setText(
                unitAccessories == null ? '' : unitAccessories.toString().toUpperCase(),
            );
            form.getTextField('workPerformed').setText(
                workPerformed == null ? '' : workPerformed.toString().toUpperCase(),
            );
            form.getTextField('workPerformed_2').setText(
                workPerformed == null ? '' : workPerformed.toString().toUpperCase(),
            );
            form.getTextField('sCharge').setText(
                sCharge == null ? '' : sCharge.toString().toUpperCase(),
            );
            form.getTextField('sCharge_2').setText(
                sCharge == null ? '' : sCharge.toString().toUpperCase(),
            );
            form.getTextField('sPayMeth').setText(
                sPayMeth == null ? '' : sPayMeth.toString().toUpperCase(),
            );
            form.getTextField('sPayMeth_2').setText(
                sPayMeth == null ? '' : sPayMeth.toString().toUpperCase(),
            );
            form.getTextField('sDownPayment').setText(
                sDownPayment == null ? '' : sDownPayment.toString().toUpperCase(),
            );
            form.getTextField('sDownPayment_2').setText(
                sDownPayment == null ? '' : sDownPayment.toString().toUpperCase(),
            );
            form.getTextField('sBalance').setText(
                sBalance == null ? '' : sBalance.toString().toUpperCase(),
            );
            form.getTextField('sBalance_2').setText(
                sBalance == null ? '' : sBalance.toString().toUpperCase(),
            );
            form.getTextField('sStatus').setText(
                sStatus == null ? '' : sStatus.toString().toUpperCase(),
            );
            form.getTextField('sStatus_2').setText(
                sStatus == null ? '' : sStatus.toString().toUpperCase(),
            );
            form.getTextField('sUnitDropOff').setText(
                sUnitDropOff == null ? '' : (sUnitDropOff ? "Yes" : "No").toUpperCase(),
            );
            form.getTextField('sUnitDropOff_2').setText(
                sUnitDropOff == null ? '' : (sUnitDropOff ? "Yes" : "No").toUpperCase(),
            );
            form.getTextField('sRelDate').setText(
                sRelDate == null || sRelDate == '' ? '' : moment(sRelDate, 'YYYY-MM-DD').format('MMM DD, YYYY').toUpperCase(),
            );
            form.getTextField('sRelDate_2').setText(
                sRelDate == null || sRelDate == '' ? '' : moment(sRelDate, 'YYYY-MM-DD').format('MMM DD, YYYY').toUpperCase(),
            );

            form.flatten();

            // Generate qr
            const url =
                'https://comtechdashboard.onrender.com/tracking-app/' + _id;
            const qrCodeImage = await this.generateQRCode(url).then(
                (qrCodeData) => pdfDoc.embedPng(qrCodeData),
            );

            // Add QR code image to PDF
            page.drawImage(qrCodeImage, {
                x: page.getWidth() - 77, // 10px from the right side
                y: page.getHeight() - 89, // 10px from the top
                width: 70,
                height: 70,
            });

            page.drawImage(qrCodeImage, {
                x: page.getWidth() - 77, // 10px from the right side
                y: page.getHeight() - 483, 
                width: 70,
                height: 70,
            });


            // Save the document
            const pdfBytes = await pdfDoc.save();
            // await writeFile('job-order-slip.pdf', pdfBytes);

            return Buffer.from(pdfBytes);
        } catch (error) {
            console.log('Error from report_generator: ');
            console.log(error);
            throw new InternalServerErrorException('Error generating report');
        }
    }


    async generateReportByYear(year: number): Promise<Buffer> {
        const jobs = await this.jobModel.find({
            jobDate: { $regex: `^${year}-` },
        });
        const date = moment(`${year}-01-01`);
        return this.generatePdf(jobs, `Annual Revenue Report (${date.format('YYYY')})`);
    }
    
    async generateReportByMonth(year: number, month: number): Promise<Buffer> {
        const monthStr = month.toString().padStart(2, '0');
        const jobs = await this.jobModel.find({
            jobDate: { $regex: `^${year}-${monthStr}-` },
        });
        const date = moment(`${year}-${month}-01`);
        return this.generatePdf(jobs, `Monthly Revenue Report for ${date.format('MMMM YYYY')}`);
    }
    
    private async generatePdf(jobs: Job[], title: string): Promise<Buffer> {
        const pdfDoc = await PDFDocument.create();
        const fontSize = 12;
        const margin = 30;
        const rowHeight = 20;
        const maxRowsPerPage = 35; // Adjust based on available space
        const date = moment(new Date())
        const currentDateTime = date.format('yyyy-MM-DD HH:mm:ss'); // Format date & time

    
        let page = pdfDoc.addPage([600, 800]);
        let { width, height } = page.getSize();
        let y = height - 80 - 20 - 40; // Adjusted to make space for title
    
        const tableHeaders = ["J.O. #", "WORK PERFORMED", "STATUS", "DATE", "PAYMENT"];
        const columnWidths = [70, 180, 120, 90, 120];
    
        let totalDownPayment = 0;
        const filteredJobs = jobs.filter(job => job.sDownPayment > 0);

        // Load the image
        // const logoBytes = fs.readFileSync(logoBuffer);
        const logoImage = await pdfDoc.embedPng(logoBuffer);

        // Set logo size and position
        const logoWidth = 200;
        const logoHeight = 71;
        page.drawImage(logoImage, {
            x: (width - logoWidth) / 2,
            y: height - 80,
            width: logoWidth,
            height: logoHeight
        });

        // Draw Generation Date
        page.drawText(`System generated: ${currentDateTime}`, {
            x: width - margin - 160,
            y: height - 20,
            size: 10,
            color: rgb(0, 0, 0),
        });

        let pageIndex = 1;
        const drawPageNumber = (page: PDFPage, pageIndex: number) => {
            page.drawText(`Page ${pageIndex}`, {
                x: width / 2 - 20,
                y: 20,
                size: 10,
                color: rgb(0, 0, 0),
            });
        };

        
        // Title
        page.drawText(title, {
            x: margin,
            y: height - 110,
            size: 18,
            color: rgb(0, 0, 0),
        });
    
        // Draw Table Headers
        let xPos = margin;
        tableHeaders.forEach((header, i) => {
            page.drawText(header, { x: xPos, y, size: fontSize + 2, color: rgb(0, 0, 0) });
            xPos += columnWidths[i];
        });
        y -= rowHeight;
    
        // Draw Job Orders
        filteredJobs.forEach((job, index) => {
            drawPageNumber(page, pageIndex);
            if (y < margin + rowHeight) {
                pageIndex += 1
                // Add new page when space runs out
                page = pdfDoc.addPage([600, 800]);
                ({ width, height } = page.getSize());
                y = height - 50; // Reset Y position
    
                xPos = margin;
                tableHeaders.forEach((header, i) => {
                    page.drawText(header, { x: xPos, y, size: fontSize, color: rgb(0, 0, 0) });
                    xPos += columnWidths[i];
                });
                y -= rowHeight;
            }
    
            totalDownPayment += job.sDownPayment;
    
            const rowData = [
                job.jobOrderNum,
                job.workPerformed.length > 30 ? job.workPerformed.substring(0, 27) + '...' : job.workPerformed,
                job.sStatus,
                job.jobDate,
                `P${(job.sDownPayment ?? 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            ];
    
            xPos = margin;
            rowData.forEach((data, i) => {
                page.drawText(String(data), { x: xPos, y, size: fontSize - 2, color: rgb(0, 0, 0) });
                xPos += columnWidths[i];
            });
    
            y -= rowHeight;
        });

        // Draw Horizontal Line after Table
        // y -= 1; // Add some space before the line
        page.drawLine({
            start: { x: margin, y },
            end: { x: width - margin, y },
            thickness: 1,
            color: rgb(0, 0, 0),
        });

        
        // Total Down Payment
        y -= rowHeight;
        page.drawText(`TOTAL REVENUE: P${totalDownPayment.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, {
            x: margin,
            y,
            size: fontSize + 2,
            color: rgb(0, 0, 0),
        });
    
        const pdfBytes = await pdfDoc.save();
        return Buffer.from(pdfBytes);
    }
    
    
}

