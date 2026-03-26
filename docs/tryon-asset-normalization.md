# Try-on asset normalization (POC)

Nguồn đầu vào hiện tại nằm ngoài repo:

- `../Thử nhẫn/assets/*.webp` (3 ảnh marketing cùng một mẫu nhẫn)

Script normalize:

- `tools/tryon/normalize_ring_asset.py`

Mục tiêu của script:

1. Chấm điểm nhanh 3 ảnh đầu vào.
2. Chọn 1 ảnh tốt nhất làm nguồn cho POC.
3. Tách foreground đơn giản theo màu nền + crop vùng nhẫn.
4. Xuất asset dùng overlay.

Lệnh chạy từ root repo:

```powershell
python tools/tryon/normalize_ring_asset.py --source-dir "..\Thử nhẫn\assets" --output-dir "app\src\main\assets\tryon"
```

Output:

- `app/src/main/assets/tryon/ring_overlay_v1.png` (asset dùng để render)
- `app/src/main/assets/tryon/ring_source_selected.webp` (ảnh nguồn được chọn)
- `app/src/main/assets/tryon/normalization_report.json` (metadata chấm điểm)

Giới hạn hiện tại:

- Xóa nền là heuristic đơn giản, có thể còn viền trắng hoặc mất chi tiết phản quang.
- Nếu cần chất lượng tốt hơn, v1 cho phép thay trực tiếp `ring_overlay_v1.png` bằng bản crop/erase nền thủ công.
