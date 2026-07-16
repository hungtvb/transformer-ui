**PROJECT TITAN**

**LAST RELAY**

Game Design, Technical Architecture & Development Rules

*Từ interactive experience thành cinematic survival/puzzle game trên nền web*

| **Phiên bản**  | 1.0                                              |
|----------------|--------------------------------------------------|
| **Ngày**       | 16/07/2026                                       |
| **Repository** | hungtvb/transformer-ui                           |
| **Trạng thái** | Approved direction — ready for Sprint 0 planning |

Nguồn chuẩn cho scope, gameplay, kiến trúc, quality gate và Definition of Done.

# Cách sử dụng tài liệu

| **QUYẾT ĐỊNH SẢN PHẨM** MVP là game góc nhìn thứ nhất trong control room, kết hợp survival, puzzle và quản lý tài nguyên. Không mở rộng thành open-world hoặc third-person combat trước khi vertical slice chứng minh được core loop. |
|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|

Tài liệu này là nguồn chuẩn cho product scope, game rules, technical architecture và quy tắc delivery. Khi code, ticket hoặc ý tưởng mới mâu thuẫn với tài liệu, team phải tạo quyết định thay đổi rõ ràng thay vì âm thầm làm lệch scope.

## Mục lục nội dung

- 1\. Hiện trạng và định hướng chuyển đổi

- 2\. Game vision, fantasy và design pillars

- 3\. Core loop, session structure và trạng thái thắng/thua

- 4\. Thiết kế chi tiết các gameplay system

- 5\. Narrative, encounter, ending và replay value

- 6\. UX/HUD, input, accessibility và responsive

- 7\. Technical architecture, source map và data contracts

- 8\. Content authoring, save game và telemetry

- 9\. Testing strategy, performance budget và CI quality gates

- 10\. Roadmap, sprint scope và acceptance criteria

- 11\. Development rules, workflow và Definition of Done

- 12\. Risk register và out-of-scope

- Phụ lục A–C: State model, event catalog và review checklists

## Quy ước quyết định

| **Mức** | **Ý nghĩa**                                            | **Cách thay đổi**                                      |
|---------|--------------------------------------------------------|--------------------------------------------------------|
| MUST    | Bắt buộc để bảo toàn kiến trúc hoặc chất lượng.        | Chỉ thay đổi qua ADR hoặc cập nhật phiên bản tài liệu. |
| SHOULD  | Mặc định phải tuân theo; có thể ngoại lệ khi có lý do. | Nêu lý do và trade-off trong PR.                       |
| MAY     | Tùy chọn, không phải acceptance gate.                  | Team tự quyết trong phạm vi ticket.                    |

# 1. Hiện trạng và định hướng chuyển đổi

## 1.1 Baseline hiện tại

Repository hiện là một cinematic interactive experience xây bằng Vite, Three.js và GSAP. Flow chính đã có Calibration → Restore Power → Tune Signal → Radar Tracking → Hand Contact → Acknowledge → Ending. Mã nguồn đã bước đầu tách audio, effects, input, phase director, entity world và experience state machine.

| **Thành phần hiện có**          | **Giá trị có thể tái sử dụng**                                 | **Khoảng trống để thành game**                                                  |
|---------------------------------|----------------------------------------------------------------|---------------------------------------------------------------------------------|
| Three.js station + entity       | Không gian 3D, camera, ánh sáng, bloom và entity choreography. | Chưa có world simulation, damage feedback hoặc encounter lifecycle.             |
| Phase state machine             | Điều phối chuỗi narrative hiện tại.                            | Quá tuyến tính; chưa biểu diễn session, failure, retry và concurrent systems.   |
| Power / tuner / radar / contact | Prototype tốt cho bốn kiểu input.                              | Đều có nghiệm đúng cố định; không có cost, risk hoặc variation.                 |
| Audio/effects/input controllers | Là adapter presentation phù hợp để giữ lại.                    | Cần nhận event từ engine thay vì giữ business state rải rác trong DOM.          |
| Node test + Vite build          | Có nền tảng quality gate tối thiểu.                            | Chưa có gameplay simulation, browser E2E, performance budget và soft-lock test. |

## 1.2 Lý do bản hiện tại chưa phải game

- Không có điều kiện thất bại, áp lực thời gian hoặc hậu quả tích lũy.

- Người chơi không phải lựa chọn giữa các mục tiêu cạnh tranh.

- Mọi lượt chơi có cùng nghiệm và cùng diễn biến.

- Interaction chủ yếu kiểm tra người chơi có làm theo hướng dẫn hay không.

- Không có score, progression, unlock, archive hoặc lý do để replay.

## 1.3 Hướng chuyển đổi

| **NORTH STAR** Giữ sự điện ảnh và cảm giác “first contact”, nhưng đặt chúng lên trên một simulation nhỏ, dễ hiểu, có trade-off thật và tạo ra câu chuyện khác nhau từ quyết định của người chơi. |
|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|

Phiên bản game sẽ giữ người chơi trong control room để tận dụng asset và giới hạn scope. Sự căng thẳng đến từ hệ thống trạm, tín hiệu, mục tiêu radar và chiến đấu diễn ra ngoài cửa kính; không đến từ việc xây một thế giới đi lại tự do quá lớn.

# 2. Game vision và design pillars

## 2.1 High concept

PROJECT TITAN: LAST RELAY là game web first-person cinematic survival/puzzle. Người chơi là kỹ thuật viên cuối cùng trên Orbital Relay 07. Sau khi đánh thức trạm, họ bắt được tín hiệu của một thực thể cơ khí khổng lồ đang bị truy đuổi. Trong 10–15 phút, người chơi phải giữ trạm hoạt động, xác định ai đang nói thật và quyết định số phận của relay.

## 2.2 Player fantasy

- Tôi là người duy nhất có thể làm một cỗ máy đang chết sống lại.

- Mỗi công tắc tôi chạm vào đều có hậu quả thấy được trong thế giới 3D.

- Tôi đang giao tiếp với một sinh vật khổng lồ thông qua kính, radar và tín hiệu.

- Tôi phải bình tĩnh đưa ra quyết định trong khi mọi hệ thống cùng suy sụp.

## 2.3 Design pillars

| **Pillar**           | **Nguyên tắc**                                                        | **Kiểm chứng**                                                                  |
|----------------------|-----------------------------------------------------------------------|---------------------------------------------------------------------------------|
| Physical interaction | Input phải giống vận hành máy: kéo, giữ, tune, route, lock, time.     | Người chơi hiểu action qua phản hồi trực quan mà không cần đoạn hướng dẫn dài.  |
| Meaningful pressure  | Thời gian và tài nguyên tạo ưu tiên; không biến thành spam cảnh báo.  | Trong encounter, luôn có ít nhất hai việc hợp lý nhưng không thể làm đồng thời. |
| Visible consequence  | Mọi thay đổi state có tín hiệu âm thanh, HUD và world feedback.       | Người chơi giải thích được vì sao họ mất Hull hoặc Signal.                      |
| Cinematic restraint  | Cinematic nhấn mạnh quyết định, không chiếm quyền điều khiển quá lâu. | Cutscene không khóa input quá 6 giây trong gameplay chính.                      |
| Replayable story     | Variation và choice tạo run khác nhau nhưng vẫn kiểm soát được scope. | Run thứ hai thay đổi ít nhất ba event/target/điều kiện.                         |

## 2.4 Target platform và audience

| **Thuộc tính** | **Mục tiêu**                                                                       |
|----------------|------------------------------------------------------------------------------------|
| Platform       | Modern desktop/mobile browser; GitHub Pages-compatible static deployment.          |
| Input          | Mouse, keyboard và touch là first-class; gamepad là post-MVP.                      |
| Session        | 10–15 phút; restart nhanh; không yêu cầu tài khoản.                                |
| Audience       | Người thích sci-fi cinematic, escape-room interaction và game ngắn giàu không khí. |
| Rating         | Căng thẳng nhẹ, không gore, không jump-scare bắt buộc.                             |

# 3. Core loop và session structure

## 3.1 Core gameplay loop

1.  Observe: đọc cảnh báo, âm thanh, trạng thái HUD và chuyển động ngoài trạm.

2.  Prioritize: chọn hệ thống cần xử lý trước dựa trên risk hiện tại.

3.  Operate: hoàn thành minigame hoặc phân phối tài nguyên.

4.  Resolve: engine áp dụng success/failure, cost và consequence.

5.  Adapt: event director thay đổi tình huống và buộc người chơi lập kế hoạch mới.

## 3.2 Session structure

| **Act**          | **Mục tiêu**                                 | **Gameplay chính**                  | **Thời lượng** |
|------------------|----------------------------------------------|-------------------------------------|----------------|
| Prologue         | Đánh thức terminal và vào station.           | Calibration, input/audio consent.   | 0.5–1 phút     |
| Act 1: Awakening | Khôi phục điện và xác nhận tín hiệu.         | Power routing, signal tuning.       | 2–3 phút       |
| Act 2: Hunt      | Theo dõi Titan và sống qua lỗi hệ thống.     | Radar, repair, resource trade-off.  | 3–4 phút       |
| Act 3: Siege     | Chống lại drone và giữ relay hoạt động.      | Shield, EMP, multi-system pressure. | 3–4 phút       |
| Finale           | Xác lập contact và quyết định số phận relay. | Trust check, final choice, ending.  | 1.5–2 phút     |

## 3.3 Core resources

| **Resource** | **Range** | **Tăng bởi**                        | **Giảm bởi**                          | **Vai trò**                              |
|--------------|-----------|-------------------------------------|---------------------------------------|------------------------------------------|
| Power        | 0–100     | Generator, shutdown module.         | Active systems, overload, EMP.        | Ngân sách năng lượng tức thời.           |
| Hull         | 0–100     | Repair event, Titan support.        | Impact, shield failure.               | Về 0 tạo game over.                      |
| Signal       | 0–100     | Correct tuning, antenna alignment.  | Noise, low comm power, jamming.       | Mở message, choice và hỗ trợ.            |
| Trust        | -100–100  | Honest response, successful assist. | False lock, betrayal, ignore request. | Thay đổi dialogue, support và ending.    |
| Threat       | 0–100     | —                                   | Không giảm trực tiếp trong MVP.       | Điều khiển intensity và final encounter. |

## 3.4 Win, loss và fail-forward

Win không chỉ là giữ tất cả resource ở mức cao. Người chơi thắng khi đưa session tới một ending hợp lệ và chấp nhận hậu quả của lựa chọn. Game over chỉ dùng cho failure rõ ràng như Hull = 0, Life Support countdown = 0 hoặc unrecoverable blackout.

- Minigame thất bại SHOULD gây damage, cost hoặc biến đổi route; không luôn reset bắt làm lại.

- Một error đơn lẻ MUST không tạo soft-lock.

- Sau game over, người chơi MUST thấy nguyên nhân chính, hai sai lầm gần nhất và nút Restart.

- Restart MUST khởi tạo run mới mà không reload toàn bộ trang.

# 4. Gameplay systems

## 4.1 Power System

Power System là lớp chiến thuật trung tâm. Người chơi phân phối output hữu hạn cho Life Support, Radar, Communication, Shield và Repair. Mỗi module có mức OFF / LOW / NOMINAL / BOOST và đường cong consumption riêng.

| **Rule**      | **Chi tiết**                                                                        |
|---------------|-------------------------------------------------------------------------------------|
| Budget        | Tổng allocation không được vượt generator output trừ khi player chủ động Overdrive. |
| Brownout      | Nếu demand vượt output trong hơn 2 giây, module ưu tiên thấp lần lượt bị hạ cấp.    |
| Overdrive     | Cho thêm output ngắn hạn nhưng tăng heat và xác suất fuse event.                    |
| Feedback      | Ánh sáng station, screen noise và audio hum phản ánh power state.                   |
| Accessibility | Không dùng màu đơn độc; hiển thị icon, label và mức chữ.                            |

## 4.2 Signal System

Signal target được sinh từ run seed. Người chơi điều chỉnh frequency và phase/noise filter. Lock quality phải được giữ ổn định đủ thời gian; không chỉ chạm đúng một điểm.

- Có tín hiệu thật, decoy và burst message ngắn.

- Low communication power làm waveform rung và thu hẹp thời gian phản ứng.

- Signal ≥ 70 mở message cơ bản; ≥ 90 mở dữ liệu chiến thuật hoặc choice tốt hơn.

- Không dùng random target sát biên khiến touch input khó thao tác.

## 4.3 Radar System

Radar chuyển từ một target cố định thành tactical tracking. Entity world cung cấp contact trajectory; engine quyết định contact identity và threat. Presentation chỉ project vị trí lên radar.

| **Contact** | **Biểu hiện**                                  | **Nếu khóa đúng**                | **Nếu khóa sai**                       |
|-------------|------------------------------------------------|----------------------------------|----------------------------------------|
| Titan       | Di chuyển có pattern, phản hồi challenge code. | Tăng Trust và mở assist.         | Mất thời gian; không damage trực tiếp. |
| Drone       | Tốc độ cao, đổi hướng đột ngột.                | Cho phép EMP hoặc shield timing. | Tăng Threat và có thể nhận impact.     |
| Decoy       | Tín hiệu đẹp nhưng không có parallax hợp lệ.   | Giảm noise tạm thời.             | Signal giảm, Trust có thể giảm.        |
| Debris      | Quỹ đạo ổn định, không phản hồi.               | Cảnh báo impact sớm.             | Shield tiêu hao sai mục tiêu.          |

## 4.4 Damage & Repair System

Damage tạo fault theo zone và severity. Fault phải có telegraph, countdown hợp lý và một đường recovery. MVP dùng ba family: fuse replacement, pressure seal và antenna alignment.

- Fault event MUST chỉ rõ system bị ảnh hưởng và consequence nếu bỏ qua.

- Không spawn hai interaction chiếm cùng vùng UI tại cùng thời điểm.

- Severity cao hơn làm input khó hơn hoặc thời gian ngắn hơn; không thay đổi luật bí mật.

- Repair thành công sớm SHOULD thưởng Power, Hull hoặc Threat delay.

## 4.5 Encounter Director

Encounter Director chọn event dựa trên act, resource, cooldown và run seed. Nó không được thao tác DOM/Three.js. Output là domain event để các adapter phát animation, audio và HUD notification.

> EncounterCandidate {  
> id, actRange, weight, prerequisites, exclusions, cooldown,  
> telegraphDuration, resolveWindow, successEffects, failureEffects  
> }

## 4.6 Trust & Choice System

Trust không hiển thị như thanh điểm chính xác trong lượt chơi đầu. Người chơi đọc trust qua lời thoại, ánh mắt, khoảng cách entity và mức hỗ trợ. Transmission Archive có thể hiển thị breakdown sau ending.

# 5. Narrative, endings và replay value

## 5.1 Narrative rules

- Narrative phải được truyền qua radio, terminal, world event và lựa chọn ngắn; tránh đoạn text dài giữa combat pressure.

- Mỗi message quan trọng phải có bản text; audio không được là kênh duy nhất.

- Optimus/Titan không giải quyết vấn đề thay người chơi; hỗ trợ là phần thưởng từ Trust.

- Không đưa lore mới nếu không thay đổi quyết định hoặc hiểu biết của người chơi.

- Cinematic chỉ kích hoạt khi engine đã commit state để reload/pause không làm sai kết quả.

## 5.2 Final choices

| **Choice**       | **Điều kiện nổi bật**            | **Hệ quả**                                                 |
|------------------|----------------------------------|------------------------------------------------------------|
| Open Relay       | Signal và Trust đủ cao.          | Titan nhận route; trạm tiếp tục phát sóng và bị truy đuổi. |
| Seal the Signal  | Player ưu tiên station survival. | Titan mất liên lạc nhưng relay an toàn hơn.                |
| Sacrifice Relay  | Threat cao hoặc player chủ động. | Dữ liệu bị xóa; Titan thoát; trạm bị hủy.                  |
| Transfer Control | Trust cực cao hoặc bị lừa.       | Ending thay đổi theo identity contact đã xác minh.         |

## 5.3 MVP endings

| **Ending**        | **Điều kiện khung**                                  | **Thông điệp**                                   |
|-------------------|------------------------------------------------------|--------------------------------------------------|
| Autobot Alliance  | Trust cao, Titan verified, relay còn hoạt động.      | Niềm tin được xây bằng hành động dưới áp lực.    |
| Silent Sacrifice  | Player phá relay hoặc chặn signal để bảo vệ Titan.   | Một chiến thắng không ai biết tới.               |
| Enemy Acquisition | Contact sai hoặc transfer khi verification thất bại. | Hiệu quả kỹ thuật không thay thế được phán đoán. |
| Station Lost      | Hull/Life Support về 0.                              | Game over có cause chain rõ ràng.                |

## 5.4 Replay variation

- Seed thay đổi signal target, contact order, fault location và một số dialogue branch.

- Event pool dùng weight + cooldown, không random vô điều kiện.

- Run thứ hai mở Transmission Archive và bỏ qua Calibration nếu người chơi muốn.

- Scoring gồm time, accuracy, damage avoided, Trust outcome và ending modifier.

- Không dùng grind, daily reward hoặc monetization trong MVP.

# 6. UX, HUD và input

## 6.1 Information hierarchy

| **Priority** | **Nội dung**                          | **Quy tắc hiển thị**                                             |
|--------------|---------------------------------------|------------------------------------------------------------------|
| P0           | Immediate danger / critical countdown | Luôn đọc được, có audio + motion + text; không bị cinematic che. |
| P1           | Objective và interaction prompt       | Một primary objective tại một thời điểm; wording là động từ.     |
| P2           | Resource status và system health      | Persistent nhưng giảm opacity khi không relevant.                |
| P3           | Lore, archive, diagnostic detail      | On-demand; không tranh attention trong encounter.                |

## 6.2 HUD rules

- HUD MUST phản ánh state từ engine; không tự suy ra business state từ CSS class.

- Mỗi cảnh báo có severity, source, timeout và acknowledgement policy.

- Không hiển thị hơn ba cảnh báo active cùng lúc; nhóm lỗi cùng system.

- Text thông thường đạt contrast tối thiểu 4.5:1; essential graphics đạt 3:1.

- Touch target tối thiểu 44×44 CSS px; interaction kéo có vùng bắt rộng hơn hình vẽ.

- Không dùng red/cyan là khác biệt duy nhất; thêm shape, icon, label hoặc pattern.

## 6.3 Input model

| **Action**        | **Pointer**      | **Keyboard**          | **Touch**             |
|-------------------|------------------|-----------------------|-----------------------|
| Select/activate   | Click            | Enter / Space         | Tap                   |
| Adjust continuous | Drag / wheel     | Arrow; Shift = coarse | Drag                  |
| Hold action       | Pointer hold     | Space hold            | Press and hold        |
| Pause             | Menu button      | Escape / P            | Menu button           |
| Cancel            | Secondary action | Escape                | Dedicated cancel area |

## 6.4 Responsive and reduced motion

- Desktop 1024–1440: full control-room composition và persistent console.

- Tablet 768: reposition panels; không scale toàn bộ desktop UI xuống.

- Mobile 375+: single active control, compact resource strip, safe-area aware.

- Reduced motion: loại camera shake, glitch lặp và parallax; giữ state transition cần thiết.

- Pause khi tab hidden; resume phải bỏ qua delta tích lũy để tránh spike simulation.

# 7. Technical architecture

## 7.1 Architectural goal

| **RULE TỐI CAO** Game engine phải chạy và test được mà không cần DOM, WebGL, audio hoặc thời gian thực của trình duyệt. Presentation nhận state snapshot và domain event; không sở hữu luật thắng/thua. |
|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|

## 7.2 Layer boundaries

| **Layer**         | **Được phép biết**                                | **Không được phép biết**                     |
|-------------------|---------------------------------------------------|----------------------------------------------|
| Game Engine       | Pure data, commands, clock ticks, RNG interface.  | DOM, Three.js, CSS, Web Audio, localStorage. |
| Systems           | GameState slice, domain events, configuration.    | Concrete renderer hoặc input device.         |
| Mission/Encounter | Conditions, objectives, effects, content IDs.     | Mesh, selector, animation timeline.          |
| Presentation      | Readonly snapshot, emitted events, visual assets. | Tự mutate resource hoặc quyết định ending.   |
| Adapters          | Browser input, audio, persistence, telemetry.     | Game rule hoặc narrative branch logic.       |

## 7.3 Proposed source map

> src/  
> ├── game/  
> │ ├── GameEngine.js \# command queue, tick, snapshot  
> │ ├── GameState.js \# canonical serializable state  
> │ ├── GameClock.js \# fixed timestep + pause  
> │ ├── EventBus.js \# domain event stream  
> │ ├── Rng.js \# seeded deterministic RNG  
> │ └── SaveGame.js \# schema/version/migration  
> ├── systems/  
> │ ├── PowerSystem.js  
> │ ├── DamageSystem.js  
> │ ├── SignalSystem.js  
> │ ├── RadarSystem.js  
> │ ├── TrustSystem.js  
> │ └── EncounterSystem.js  
> ├── missions/  
> │ ├── MissionDirector.js  
> │ ├── objectives/  
> │ └── events/  
> ├── world/  
> │ ├── StationScene.js  
> │ ├── TitanEntity.js  
> │ ├── EnemyEntities.js  
> │ └── CameraDirector.js  
> ├── presentation/  
> │ ├── HudController.js  
> │ ├── AudioController.js  
> │ ├── EffectsController.js  
> │ └── InputController.js  
> ├── content/  
> │ ├── missions.js  
> │ ├── encounters.js  
> │ └── dialogue.js  
> └── main.js \# composition root only

## 7.4 Canonical state

> GameState {  
> schemaVersion, runId, seed, status, act, elapsedMs,  
> resources: { power, hull, signal, trust, threat },  
> systems: { generator, lifeSupport, radar, comms, shield, repair },  
> mission: { id, objectiveIds, activeEncounterId },  
> contacts: {}, faults: \[\], flags: {}, history: \[\]  
> }

## 7.5 Command and event flow

Input adapter chuyển user action thành Command. Engine validate Command, update canonical state và emit Domain Event. Presentation dùng Domain Event cho animation/audio; HUD render từ snapshot mới. Nếu presentation lỗi, game state vẫn hợp lệ.

| **Command ví dụ**                   | **Domain event ví dụ**                     |
|-------------------------------------|--------------------------------------------|
| ALLOCATE_POWER(moduleId, level)     | POWER_ALLOCATION_CHANGED, BROWNOUT_STARTED |
| SET_SIGNAL_TUNING(frequency, phase) | SIGNAL_QUALITY_CHANGED, SIGNAL_LOCKED      |
| LOCK_CONTACT(contactId)             | CONTACT_LOCK_STARTED, CONTACT_VERIFIED     |
| COMPLETE_REPAIR(faultId, result)    | FAULT_RESOLVED, HULL_CHANGED               |
| SELECT_FINAL_CHOICE(choiceId)       | ENDING_COMMITTED                           |

## 7.6 Simulation rules

- Engine MUST dùng fixed timestep hoặc deterministic discrete update; render có thể chạy tốc độ khác.

- Randomness MUST đi qua seeded RNG interface; không gọi Math.random trực tiếp trong system.

- State mutation MUST đi qua command/system reducer; presentation không mutate state.

- Event handler MUST idempotent hoặc có event ID để tránh double-resolution.

- Timer gameplay MUST dựa trên game clock; không dùng setInterval rải rác làm nguồn chân lý.

- Snapshot lưu MUST là JSON-serializable và có schemaVersion.

# 8. Content, persistence và observability

## 8.1 Data-driven content

Mission, encounter, dialogue và balance constant SHOULD được khai báo bằng data module có schema validation. Thêm content mới không nên yêu cầu sửa GameEngine.

> EncounterDefinition {  
> id, actRange, weight, cooldownMs, prerequisites, exclusions,  
> telegraph, objective, timeoutMs, successEffects, failureEffects  
> }

## 8.2 Save game

- Auto-save tại act boundary, final choice và khi tab chuyển hidden nếu state ổn định.

- Không save giữa một atomic resolution đang chạy.

- MVP lưu localStorage; dữ liệu không chứa PII.

- Version mismatch phải migrate hoặc bỏ save có thông báo, không crash boot flow.

- Settings (audio, motion, subtitles) tách khỏi run save.

## 8.3 Telemetry tối thiểu

| **Event**          | **Mục đích**                    | **Dữ liệu**                                   |
|--------------------|---------------------------------|-----------------------------------------------|
| run_started        | Đếm start và cấu hình thiết bị. | seed hash, viewport class, input mode         |
| act_completed      | Tìm điểm rơi người chơi.        | act, duration, resources                      |
| encounter_resolved | Balance difficulty.             | encounterId, result, attempts, remaining time |
| game_over          | Tìm failure chain.              | cause, last events, act                       |
| ending_reached     | Đo completion và choice.        | endingId, duration, score band                |

Nếu chưa có analytics backend, event vẫn ghi vào bounded in-memory history để result screen và automated test sử dụng. Không block gameplay vì telemetry failure.

# 9. Testing, performance và CI

## 9.1 Test pyramid

| **Layer**          | **Phạm vi**                           | **Ví dụ gate**                                                |
|--------------------|---------------------------------------|---------------------------------------------------------------|
| Unit               | Pure system/reducer/RNG/balance math. | Power conservation, damage clamp, trust thresholds.           |
| Simulation         | Headless run bằng command script.     | Mọi seed mẫu có đường tới win/loss, không soft-lock.          |
| Integration        | Engine + mission + content schema.    | Encounter effect, save/restore, act transition.               |
| Browser E2E        | DOM + input + rendering smoke.        | Happy path, game over, restart, keyboard/touch critical flow. |
| Visual/performance | Viewport và frame budget.             | 375/768/1024/1440, console error, FPS/memory smoke.           |

## 9.2 Mandatory test cases

- Power allocation không tạo hoặc làm mất energy ngoài effect đã khai báo.

- Hull/Signal/Trust luôn clamp đúng range.

- Pause/resume không làm timer nhảy hoặc encounter resolve hai lần.

- Save/restore cùng seed tạo cùng state tiếp theo với cùng command sequence.

- Mọi final choice commit đúng một ending.

- Game over và Restart hoạt động không reload trang.

- Keyboard-only và touch critical path hoàn thành được.

- Reduced-motion không làm mất gameplay feedback thiết yếu.

## 9.3 Performance budget

| **Metric**      | **Desktop target**                    | **Mobile target** | **Hard rule**                                                |
|-----------------|---------------------------------------|-------------------|--------------------------------------------------------------|
| Frame rate      | ≈60 FPS                               | ≥30 FPS           | Không giữ dưới target quá 3 giây trong gameplay bình thường. |
| Render scale    | ≤1.6 DPR                              | ≤1.1–1.25 DPR     | Adaptive quality được phép; gameplay timing không đổi.       |
| Initial JS gzip | ≤350 KB mục tiêu                      | ≤350 KB mục tiêu  | Asset lớn phải lazy-load theo act.                           |
| Input latency   | \<100 ms                              | \<120 ms          | Không chờ animation để ghi nhận command.                     |
| Memory          | Không tăng liên tục qua 3 lần restart | Tương tự          | Dispose Three.js geometry/material/listener.                 |

## 9.4 CI quality gates

- Mỗi PR chạy unit + simulation + build.

- Browser E2E critical path chạy khi thay đổi engine, mission, input, HUD hoặc deployment config.

- Full visual/performance suite chạy trước merge release hoặc theo scheduled workflow.

- CI failure MUST được xử lý trước merge; không bypass bằng cách xóa test hoặc nới threshold không có lý do.

- Deploy preview/release chỉ chạy từ commit đã qua required checks.

# 10. Roadmap và sprint acceptance

## 10.1 Sprint overview

| **Sprint** | **Mục tiêu**                             | **Deliverable**                                                 | **Ước lượng** |
|------------|------------------------------------------|-----------------------------------------------------------------|---------------|
| Sprint 0   | Refactor nền tảng không đổi UX hiện tại. | Headless GameEngine, canonical state, clock, RNG, adapters.     | 2–3 ngày      |
| Sprint 1   | Vertical slice có cảm giác là game.      | 5–7 phút, Power trade-off, repair, radar, game over, 2 endings. | 4–6 ngày      |
| Sprint 2   | Tạo tactical depth và variation.         | Shield/Life Support, encounter director, signal/radar nâng cao. | 4–6 ngày      |
| Sprint 3   | Hoàn thiện cao trào và narrative.        | Drone siege, Titan support, Trust, 3 endings.                   | 4–6 ngày      |
| Sprint 4   | Polish và release readiness.             | Archive, score, save, accessibility, mobile, perf, E2E.         | 3–5 ngày      |

## 10.2 Sprint 0 — Foundation

- GameState serializable, có schemaVersion và khởi tạo từ seed.

- GameEngine chạy headless; main.js chỉ composition và wiring.

- GameClock hỗ trợ fixed tick, pause/resume và không tích lũy hidden delta.

- Power/Signal/Tracking state được chuyển khỏi DOM state.

- Flow hiện tại vẫn hoàn thành được; không regression contact/ending.

- Unit test cho transition, clamp, RNG và restart.

## 10.3 Sprint 1 — Playable vertical slice

- Một run dài 5–7 phút có intro, mid-pressure và final decision.

- Power allocation buộc chọn ít nhất một trade-off thật.

- Có một repair event và một radar encounter có thể thất bại.

- Hull damage, game over, result screen và restart không reload.

- Có hai ending phụ thuộc state/choice, không chỉ khác đoạn text cuối.

- Ít nhất ba seed test hoàn thành được bằng automated simulation.

## 10.4 MVP release acceptance

| **Nhóm**      | **Acceptance**                                                                    |
|---------------|-----------------------------------------------------------------------------------|
| Gameplay      | Run 8–15 phút; win, game over, 3 minigame family và 3 endings.                    |
| Replay        | Seed/event variation làm run thứ hai khác tối thiểu ba điểm.                      |
| UX            | Objective rõ, cause of failure rõ, restart trong tối đa hai action.               |
| Accessibility | Mouse/keyboard/touch; subtitles; reduced motion; contrast/touch target đạt chuẩn. |
| Performance   | Desktop gần 60 FPS, mobile tối thiểu 30 FPS trên profile mục tiêu.                |
| Reliability   | Không soft-lock; không double-resolve; save schema có migration strategy.         |
| Quality       | Required CI xanh và critical E2E pass.                                            |

# 11. Development rules

## 11.1 Architecture rules — MUST

- Không đặt gameplay rule, resource mutation hoặc ending condition trong DOM handler, CSS class hoặc Three.js object.

- Không gọi Math.random trực tiếp trong gameplay system; luôn dùng seeded RNG.

- Không dùng setTimeout/setInterval làm nguồn chân lý cho gameplay timer; luôn dùng GameClock.

- Mỗi state change phải đi qua command/system và phát domain event tương ứng khi cần presentation feedback.

- GameState phải serializable; không lưu mesh, DOM node, audio node, function hoặc cyclic object.

- Presentation chỉ đọc snapshot và event; không quyết định success/failure.

- Mỗi listener, geometry, material, texture và audio resource được tạo phải có lifecycle dispose rõ ràng.

## 11.2 Gameplay design rules — MUST

- Mỗi mechanic mới phải mô tả objective, input, feedback, success, failure, cost và recovery.

- Không thêm minigame chỉ để kéo dài thời lượng; nó phải tác động resource, information hoặc branch.

- Không tạo failure không telegraph hoặc luật thay đổi bí mật.

- Không có một sai lầm đơn lẻ gây soft-lock; terminal failure phải có game-over resolution rõ ràng.

- Mọi lựa chọn narrative quan trọng phải commit consequence vào GameState, không chỉ đổi copy.

- Difficulty tăng bằng pressure, variation hoặc simultaneous priority; không chỉ giảm touch target hay làm input thiếu chính xác.

## 11.3 UX and visual rules — MUST

- Gameplay-critical information không được dựa duy nhất vào màu, âm thanh hoặc motion.

- Tại một thời điểm chỉ có một primary interaction prompt.

- Cinematic không được che P0 warning hoặc nuốt input đã hợp lệ.

- Animation kết thúc phải đưa UI về state xác định; không dùng animation callback làm business commit duy nhất.

- Mobile layout được thiết kế riêng theo hierarchy, không chỉ scale desktop.

- Reduced motion giữ nguyên timing và luật gameplay.

## 11.4 Code quality rules — SHOULD

- Module có single responsibility và public API nhỏ; composition nằm ở main.js/bootstrap.

- Magic number chuyển thành named config với unit và phạm vi rõ ràng.

- Event/command name dùng past tense cho event, imperative cho command.

- Không tạo fallback handler trùng chức năng nếu có thể sửa lifecycle hoặc ownership gốc.

- Comment giải thích why/trade-off; tên code và test giải thích what.

- Không merge dead code, console noise, TODO không có ticket hoặc asset không rõ license.

## 11.5 Git and PR workflow

- Một PR chỉ giải quyết một mục tiêu có thể review; refactor nền tảng tách khỏi content/polish lớn.

- PR description gồm problem, scope, gameplay impact, architecture impact, test evidence và screenshot/video nếu có UI.

- Thay đổi GameState schema, event contract hoặc layer boundary phải kèm ADR/doc update.

- Không merge khi required checks đỏ hoặc review thread còn actionable.

- Commit message mô tả intent; tránh commit “fix”, “update”, “wip” trên lịch sử cuối.

- Mỗi PR phải ghi rõ cách rollback hoặc feature flag nếu thay đổi có rủi ro cao.

## 11.6 Definition of Ready

- User/player outcome được viết rõ.

- In-scope và out-of-scope rõ.

- Acceptance criteria có thể kiểm thử.

- Dependency, asset và content requirement đã xác định.

- Architecture boundary và data affected đã biết.

- Có test approach và performance/accessibility impact nếu liên quan.

## 11.7 Definition of Done

- Acceptance criteria pass và không làm hỏng flow hiện có.

- Unit/simulation/integration/E2E tương ứng đã thêm hoặc cập nhật.

- Desktop/mobile/reduced-motion đã kiểm tra ở viewport liên quan.

- Không có console error, resource leak thấy được hoặc soft-lock.

- Performance budget không regression ngoài ngưỡng cho phép.

- Docs, content schema, event catalog hoặc ADR đã cập nhật nếu contract thay đổi.

- CI xanh và review actionable đã giải quyết.

# 12. Risks, constraints và out-of-scope

## 12.1 Risk register

| **Risk**                             | **Tác động**                              | **Giảm thiểu**                                                   |
|--------------------------------------|-------------------------------------------|------------------------------------------------------------------|
| Scope phình thành shooter/open-world | Không bao giờ có vertical slice đủ vui.   | Giữ control-room MVP; mọi expansion đi sau Sprint 1 validation.  |
| Visual code tiếp tục giữ game state  | Khó test, soft-lock, regression.          | Refactor engine/presentation ở Sprint 0; enforce review rule.    |
| Quá nhiều post-processing            | Mobile drop frame, input lag.             | Adaptive quality, lazy asset, performance gate.                  |
| Random event không công bằng         | Failure khó hiểu, replay bực bội.         | Seeded director, exclusions, cooldown, telegraph.                |
| Cinematic lấn át agency              | Người chơi cảm giác chỉ xem landing page. | Giới hạn lock input; consequence phải đến từ action.             |
| IP Transformers/Optimus              | Rủi ro khi phát hành công khai/kiếm tiền. | Dùng Project Titan và asset/âm thanh nguyên bản hoặc có license. |

## 12.2 MVP out-of-scope

- Open-world, free-roam station hoặc third-person movement.

- Full melee/shooter combat điều khiển Optimus/Titan.

- Multiplayer, leaderboard online hoặc account backend.

- Procedural story bằng LLM hoặc network-dependent gameplay.

- Monetization, battle pass, daily quest hoặc live service.

- Gamepad, VR và native mobile app.

- Official Transformers logo, model, voice hoặc copyrighted media không có license.

# Phụ lục A. State machine cấp cao

> BOOT  
> → CALIBRATION  
> → RUNNING.ACT_1  
> → RUNNING.ACT_2  
> → RUNNING.ACT_3  
> → FINAL_CHOICE  
> → ENDING  
>   
> Từ mọi RUNNING state:  
> → PAUSED → state trước đó  
> → GAME_OVER → RESULT → RESTART  
>   
> ENDING và GAME_OVER là terminal state của một run,  
> nhưng application vẫn sống để Archive/Restart hoạt động.

# Phụ lục B. Domain event catalog ban đầu

| **Event family** | **Events**                                                                  |
|------------------|-----------------------------------------------------------------------------|
| Session          | RUN_STARTED, ACT_STARTED, ACT_COMPLETED, RUN_PAUSED, RUN_RESUMED, RUN_ENDED |
| Resource         | POWER_CHANGED, HULL_CHANGED, SIGNAL_CHANGED, TRUST_CHANGED, THREAT_CHANGED  |
| System           | SYSTEM_MODE_CHANGED, BROWNOUT_STARTED, BROWNOUT_ENDED, OVERLOAD_STARTED     |
| Signal           | SIGNAL_CANDIDATE_FOUND, SIGNAL_LOCKED, MESSAGE_DECODED, JAMMING_STARTED     |
| Radar            | CONTACT_APPEARED, CONTACT_LOCKED, CONTACT_VERIFIED, CONTACT_LOST            |
| Damage           | FAULT_CREATED, FAULT_ESCALATED, FAULT_RESOLVED, IMPACT_RECEIVED             |
| Encounter        | ENCOUNTER_TELEGRAPHED, ENCOUNTER_STARTED, ENCOUNTER_RESOLVED                |
| Narrative        | CHOICE_OFFERED, CHOICE_SELECTED, ENDING_COMMITTED                           |

# Phụ lục C. PR review checklist

- Scope PR đúng ticket và không kéo thêm feature ngoài acceptance criteria.

- Game rule nằm đúng engine/system; presentation không giữ canonical state.

- Timer/RNG/state mutation tuân thủ architecture rules.

- Success, failure, recovery và soft-lock path đã review.

- Input mouse/keyboard/touch và accessibility state đã kiểm tra khi liên quan.

- Resource lifecycle và performance impact đã kiểm tra.

- Test evidence đủ cho mức rủi ro; CI xanh.

- Docs/ADR/schema/event catalog được cập nhật khi contract đổi.

- Không thêm asset hoặc nội dung vi phạm license/IP.

# Quyết định tiếp theo

| **RECOMMENDED NEXT ACTION** Tách Sprint 0 thành ticket kỹ thuật, bắt đầu bằng canonical GameState + headless GameEngine + seeded RNG. Chỉ sau khi flow cũ chạy qua engine mới bắt đầu Sprint 1 vertical slice. |
|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|

Tài liệu v1.0 được xem là baseline. Mọi thay đổi lớn về genre, camera model, session length, engine boundary, state schema hoặc MVP ending phải tạo phiên bản mới và ghi change log.
