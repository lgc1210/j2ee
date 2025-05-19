package j2ee.j2ee.apps.payment;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/vnpay")
public class VNPayController {

    private final String vnp_Version = "2.1.0";
    private final String vnp_Command = "pay";
    private final String vnp_TmnCode = "FDS7TCED";
    private final String vnp_HashSecret = "H6T1Y4PUXOKZDIKGHKCJ3S85HV0NXVNU";
    private final String vnp_PayUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    private final String vnp_ReturnUrl = "http://localhost:3000/payment-result";

    @GetMapping("/get-url")
    public ResponseEntity<?> createVNPayUrl(@RequestBody Map<String, Object> appointment) {
        try {
            String orderId = UUID.randomUUID().toString().replace("-", "");
            String amount = String.valueOf(((Number) appointment.get("amount")).intValue() * 100);

            Map<String, String> vnpParams = new HashMap<>();
            vnpParams.put("vnp_Version", vnp_Version);
            vnpParams.put("vnp_Command", vnp_Command);
            vnpParams.put("vnp_TmnCode", vnp_TmnCode);
            vnpParams.put("vnp_Amount", amount);
            vnpParams.put("vnp_CurrCode", "VND");
            vnpParams.put("vnp_TxnRef", orderId);
            vnpParams.put("vnp_OrderInfo", "Booking appointment"); // <--
                                                                   // fix
                                                                   // space
            vnpParams.put("vnp_OrderType", "other");
            vnpParams.put("vnp_Locale", "vn");
            vnpParams.put("vnp_ReturnUrl", vnp_ReturnUrl);
            vnpParams.put("vnp_IpAddr", "127.0.0.1");

            String createDate = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
            vnpParams.put("vnp_CreateDate", createDate);

            List<String> fieldNames = new ArrayList<>(vnpParams.keySet());
            Collections.sort(fieldNames);

            StringBuilder hashData = new StringBuilder();
            StringBuilder query = new StringBuilder();

            for (String field : fieldNames) {
                String value = vnpParams.get(field);
                if (value != null && !value.isEmpty()) {
                    hashData.append(field).append('=').append(value).append('&');
                    query.append(field).append('=')
                            .append(URLEncoder.encode(value, StandardCharsets.US_ASCII)).append('&');
                }
            }

            // remove last &
            hashData.setLength(hashData.length() - 1);
            query.setLength(query.length() - 1);

            String secureHash = hmacSHA512(vnp_HashSecret, hashData.toString());
            query.append("&vnp_SecureHash=").append(secureHash);

            String paymentUrl = vnp_PayUrl + "?" + query.toString();

            // Debug
            System.out.println("✅ hashData: " + hashData);
            System.out.println("✅ secureHash: " + secureHash);
            System.out.println("✅ paymentUrl: " + paymentUrl);

            return ResponseEntity.ok(Map.of("paymentUrl", paymentUrl));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error creating VNPay URL");
        }
    }

    private String hmacSHA512(String key, String data) {
        try {
            Mac hmac = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmac.init(secretKey);
            byte[] bytes = hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));

            StringBuilder hex = new StringBuilder();
            for (byte b : bytes) {
                String hexChar = Integer.toHexString(0xff & b);
                if (hexChar.length() == 1)
                    hex.append('0');
                hex.append(hexChar);
            }
            return hex.toString();
        } catch (Exception e) {
            throw new RuntimeException("Cannot sign data", e);
        }
    }
}
