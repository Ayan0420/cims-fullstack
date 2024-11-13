import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PDFDocument } from 'pdf-lib';
import { readFile, writeFile } from 'fs/promises';
import * as moment from 'moment';
import * as QRCode from 'qrcode';
import { pdfBuffer } from './pdf-template-buffer';

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
                cus_address,
                cus_name,
                cus_phone,
                job_date,
                job_id,
                p_bal,
                p_downpay,
                p_installed,
                p_ord_date,
                p_ord_status,
                p_parts,
                p_price,
                p_rel_date,
                p_status,
                s_bal,
                s_charge,
                s_downpay,
                s_paymeth,
                s_status,
                unit_accessories,
                unit_model,
                unit_specs,
                work_perf,
            } = data;

            const pdfDoc = await PDFDocument.load(pdfBuffer);
            const fieldNames = pdfDoc
                .getForm()
                .getFields()
                .map((f) => f.getName());
            const [page] = pdfDoc.getPages();

            const form = pdfDoc.getForm();

            // set data to form
            form.getTextField('job_order_num').setText(
                job_id == null ? '' : job_id.toString(),
            );
            form.getTextField('tracking_code').setText(
                _id == null ? '' : _id.toString().toUpperCase().slice(-6),
            );
            form.getTextField('date').setText(
                job_date == null || job_date == ''
                    ? ''
                    : moment(job_date, 'YYYY-MM-DD').format('MMM DD, YYYY'),
            );
            form.getTextField('cus_name').setText(
                cus_name == null ? '' : cus_name.toString().toUpperCase(),
            );
            form.getTextField('cus_contact').setText(
                cus_phone == null ? '' : cus_phone.toString(),
            );
            form.getTextField('cus_adress').setText(
                cus_address == null ? '' : cus_address.toString().toUpperCase(),
            );
            form.getTextField('unit_model').setText(
                unit_model == null ? '' : unit_model.toString().toUpperCase(),
            );
            form.getTextField('unit_accessories').setText(
                unit_accessories == null
                    ? ''
                    : unit_accessories.toString().toUpperCase(),
            );
            form.getTextField('unit_specs').setText(
                unit_specs == null ? '' : unit_specs.toString().toUpperCase(),
            );
            form.getTextField('job_type').setText(
                work_perf == null ? '' : work_perf.toString().toUpperCase(),
            );
            form.getTextField('job_status').setText(
                s_status == null ? '' : s_status.toString(),
            );
            form.getTextField('s_charge').setText(
                s_charge == 0 || s_charge == null ? '' : s_charge.toString(),
            );
            form.getTextField('s_downpayment').setText(
                s_downpay == 0 || s_downpay == null ? '' : s_downpay.toString(),
            );
            form.getTextField('s_payment_method').setText(
                s_paymeth == null ? '' : s_paymeth.toString(),
            );
            form.getTextField('s_balance').setText(
                s_bal == 0 || s_bal == null ? '' : s_bal.toString(),
            );
            form.getTextField('s_date_returned').setText(
                p_rel_date == null || p_rel_date == ''
                    ? ''
                    : moment(p_rel_date, 'YYYY-MM-DD').format('MMM DD, YYYY'),
            );
            form.getTextField('parts_ordered').setText(
                p_parts == null ? '' : p_parts.toString().toUpperCase(),
            );
            form.getTextField('p_date_ordered').setText(
                p_ord_date == null || p_ord_date == ''
                    ? ''
                    : moment(p_ord_date, 'YYYY-MM-DD').format('MMM DD, YYYY'),
            );
            form.getTextField('supplier_tracking').setText('N/A');
            form.getTextField('p_price').setText(
                p_price == 0 || p_price == null
                    ? ''
                    : p_price.toString() +
                          '                                         ' +
                          p_downpay.toString(),
            );
            form.getTextField('p_delivery_status').setText(
                p_ord_status == null ? '' : p_ord_status.toString(),
            );
            form.getTextField('p_installation_status').setText(
                p_installed == null ? '' : p_installed.toString(),
            );
            form.getTextField('p_payment_status').setText(
                p_status == null ? '' : p_status.toString(),
            );
            form.getTextField('p_balance').setText(
                p_bal == 0 || p_bal == null ? '' : p_bal.toString(),
            );

            form.flatten();

            // Generate qr
            const url =
                'https://comtechdashboard.onrender.com/tracking-app/' + _id;
            const qrCodeImage = await this.generateQRCode(url).then(
                (qrCodeData) => pdfDoc.embedPng(qrCodeData),
            );

            // Define QR code position
            const qrCodeX = page.getWidth() - 77; // 10px from the right side
            const qrCodeY = page.getHeight() - 89; // 10px from the top

            // Add QR code image to PDF
            page.drawImage(qrCodeImage, {
                x: qrCodeX,
                y: qrCodeY,
                width: 70,
                height: 70,
            });

            // Save the document
            const pdfBytes = await pdfDoc.save();
            await writeFile('job-order-slip.pdf', pdfBytes);

            return Buffer.from(pdfBytes);
        } catch (error) {
            console.log('Error from report_generator: ');
            console.log(error);
            throw new InternalServerErrorException('Error generating report');
        }
    }
}

// const testGeneratePDF = new ReportGeneratorService();
// const testOrder = {
//     _id: "64a1604d3fb8e340ec89a7de",
//     cus_address: "Gingoog City",
//     cus_name: "Cj-May Libetario",
//     cus_phone: "09658834811",
//     id: 105,
//     job_date: "2022-10-19",
//     job_id: "2414",
//     p_parts: "Not Applicable",
//     p_price: "5000",
//     p_downpay: "5000",
//     p_bal: "0",
//     p_installed: "Not Applicable",
//     p_ord_date: "",
//     p_ord_status: "Not Applicable",
//     p_rel_date: "",
//     p_status: "Not Applicable",
//     p_supp: "Not Applicable",
//     s_bal: "500",
//     s_charge: "8000",
//     s_downpay: "00",
//     s_paymeth: "OVER THE COUNTER",
//     s_status: "PAID/RELEASED",
//     unit_accessories: "W/ charger ",
//     unit_model: "lenovo Ideapad 110",
//     unit_specs: "intel",
//     work_perf: "o.s reinstallation"
// }
// testGeneratePDF.generateJobOrderSlip(testOrder)
