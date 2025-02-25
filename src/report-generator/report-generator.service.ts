import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PDFDocument } from 'pdf-lib';
// import { readFile, writeFile } from 'fs/promises';
import * as moment from 'moment';
import * as QRCode from 'qrcode';
import { pdfBuffer } from './pdf-template-buffer-3';

@Injectable()
export class ReportGeneratorService {
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
                sRelDate == null ? '' : moment(sRelDate, 'YYYY-MM-DD').format('MMM DD, YYYY').toUpperCase(),
            );
            form.getTextField('sRelDate_2').setText(
                sRelDate == null ? '' : moment(sRelDate, 'YYYY-MM-DD').format('MMM DD, YYYY').toUpperCase(),
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
}

