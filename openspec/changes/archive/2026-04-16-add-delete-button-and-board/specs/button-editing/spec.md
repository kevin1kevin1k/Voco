## ADDED Requirements

### Requirement: Delete button entry point in EditButtonModal

`EditButtonModal` SHALL render a "刪除" button alongside the "取消" and "確認" buttons. The delete flow is governed by the `button-deletion` capability. The presence of this button is part of the button-editing modal's layout contract.

#### Scenario: Delete button is present in EditButtonModal

- **WHEN** EditButtonModal is open in edit mode
- **THEN** a "刪除" button is visible in the modal's action row alongside "取消" and "確認"
