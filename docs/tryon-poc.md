# Ring Try-on POC (single product)

POC này nằm trong module `:app`, package `com.handmeasure.sample.tryon`.

## Cấu trúc code

- `app/src/main/java/com/handmeasure/sample/tryon/data`
- `app/src/main/java/com/handmeasure/sample/tryon/domain`
- `app/src/main/java/com/handmeasure/sample/tryon/render`
- `app/src/main/java/com/handmeasure/sample/tryon/ui`

## Asset đang dùng

- Asset overlay chính: `app/src/main/assets/tryon/ring_overlay_v1.png`
- Ảnh nguồn được chọn từ bộ 3 ảnh marketing: `app/src/main/assets/tryon/ring_source_selected.webp`
- Báo cáo chọn ảnh: `app/src/main/assets/tryon/normalization_report.json`

Script normalize: xem `docs/tryon-asset-normalization.md`.

## Flow demo hiện tại

1. Mở sample app (`MainActivity`) -> màn hình try-on demo.
2. Bấm **Thử detect tay**:
   - Nếu measurement + landmark usable -> mode `Measured` (`Fit theo đo tay`).
   - Nếu measurement fail nhưng landmark usable -> mode `LandmarkOnly` (`Preview theo landmark`).
   - Nếu landmark không usable -> mode `Manual` (`Tự căn chỉnh`).
3. Bấm **Manual adjust** để drag/scale/rotate nhẫn bằng gesture.
4. Bấm **Export/capture** để xuất bitmap vào `files/tryon_exports`.

Tuỳ chọn: bấm **Đo tay** để gọi `HandMeasureContract` lấy measurement rồi quay lại demo.

## Giới hạn POC

- Chỉ có 1 `RingProduct` hardcode, chưa có catalog.
- Overlay 2.5D từ ảnh bitmap, chưa có 3D mesh/shader.
- Normalize nền ảnh là heuristic đơn giản, chưa clean hoàn hảo.
- Mapping preview/canvas là best-effort theo tỉ lệ khung hình.

## TODO nâng cấp sau POC

- TODO: thay `SingleRingCatalog` bằng API/backend/catalog thật.
- TODO: lưu/đọc metadata placement per product từ DB.
- TODO: thêm pipeline chuẩn hoá asset bán tự động + QA thủ công.
- TODO: hỗ trợ nhiều ring style, nhiều góc, và occlusion tay tốt hơn.
