import time
import flet as ft

APP_TITLE = "Flet vs Expo Benchmark"
PAGE_NAMES = [f"Screen {i:02d}" for i in range(1, 21)]
ITEMS = [{"id": i, "title": f"Benchmark item {i:04d}", "subtitle": f"Scrollable row #{i}"} for i in range(1, 5001)]

def main(page: ft.Page):
    page.title = APP_TITLE
    page.theme_mode = ft.ThemeMode.LIGHT
    page.padding = 12
    status = ft.Text("Ready", size=12, color=ft.Colors.GREY_700)
    content = ft.Column(expand=True, scroll=ft.ScrollMode.AUTO, spacing=10)
    selected = ft.Text("No item selected")
    search = ft.TextField(label="Search 5,000 rows", prefix_icon=ft.Icons.SEARCH)
    form_name = ft.TextField(label="Name")
    form_email = ft.TextField(label="Email")
    count = {"value": 0}

    def show_home():
        content.controls = [
            ft.Text("Cross-platform benchmark", size=24, weight=ft.FontWeight.BOLD),
            ft.Text("Equivalent interaction scenarios implemented in Flet and Expo."),
            ft.Card(content=ft.Container(padding=16, content=ft.Column([
                ft.Text("Benchmark scenarios", weight=ft.FontWeight.BOLD),
                ft.Text("20 navigable screens • 5,000-row list • form validation • motion • repeated navigation"),
                ft.Text("Use the same device, release build, and test sequence for a fair comparison.", size=12),
            ]))),
            ft.FilledButton("Open large list", on_click=lambda _: show_list()),
            ft.OutlinedButton("Open form", on_click=lambda _: show_form()),
            ft.OutlinedButton("Open motion test", on_click=lambda _: show_motion()),
            ft.Text("CI builds are not device-performance measurements.", size=12),
        ]
        page.update()

    def show_list():
        rows = ft.Column(spacing=0)
        def filter_rows(_):
            q = (search.value or "").lower()
            matches = [item for item in ITEMS if q in item["title"].lower()][:250]
            rows.controls = [
                ft.ListTile(title=ft.Text(item["title"]), subtitle=ft.Text(item["subtitle"]),
                            on_click=lambda _, item=item: select_item(item))
                for item in matches
            ]
            status.value = f"Showing {len(matches)} matching rows (max 250 rendered)"
            page.update()
        def select_item(item):
            selected.value = f"Selected: {item['title']} (id={item['id']})"
            page.update()
        search.on_change = filter_rows
        filter_rows(None)
        content.controls = [ft.Text("Large list", size=22, weight=ft.FontWeight.BOLD),
                            ft.Text("5,000 generated records; maximum 250 matching rows rendered."),
                            search, selected, rows]
        page.update()

    def show_form():
        def submit(_):
            status.value = ("Submitted locally for " + form_name.value) if form_name.value and "@" in (form_email.value or "") else "Validation failed: enter a name and valid email."
            page.update()
        content.controls = [ft.Text("Form validation", size=22, weight=ft.FontWeight.BOLD),
                            form_name, form_email,
                            ft.FilledButton("Validate and submit", on_click=submit)]
        page.update()

    def show_motion():
        count["value"] += 1
        content.controls = [
            ft.Text("Motion scenario", size=22, weight=ft.FontWeight.BOLD),
            ft.Text("Tap the tile repeatedly; compare transition smoothness and frame pacing on-device."),
            ft.AnimatedSwitcher(
                content=ft.Container(width=120, height=120, bgcolor=ft.Colors.INDIGO,
                    alignment=ft.Alignment.CENTER,
                    content=ft.Text("FLET " + str(count["value"]), color=ft.Colors.WHITE),
                    border_radius=16),
                duration=500,
                transition=ft.AnimatedSwitcherTransition.FADE),
            ft.OutlinedButton("Repeat transition", on_click=lambda _: show_motion()),
        ]
        page.update()

    def navigate(index):
        status.value = f"{PAGE_NAMES[index]} opened"
        if index == 0: show_home()
        elif index == 1: show_list()
        elif index == 2: show_form()
        elif index == 3: show_motion()
        else:
            content.controls = [ft.Text(PAGE_NAMES[index], size=22, weight=ft.FontWeight.BOLD),
                                ft.Text(f"Navigation workload screen {index + 1} / 20."),
                                ft.OutlinedButton("Back home", on_click=lambda _: show_home())]
            page.update()

    rail = ft.NavigationRail(
        selected_index=0,
        label_type=ft.NavigationRailLabelType.ALL,
        min_width=68,
        destinations=[
            ft.NavigationRailDestination(icon=ft.Icons.HOME_OUTLINED, selected_icon=ft.Icons.HOME, label="Home"),
            ft.NavigationRailDestination(icon=ft.Icons.LIST, label="List"),
            ft.NavigationRailDestination(icon=ft.Icons.EDIT_NOTE, label="Form"),
            ft.NavigationRailDestination(icon=ft.Icons.ANIMATION, label="Motion"),
            ft.NavigationRailDestination(icon=ft.Icons.GRID_VIEW, label="Screens"),
        ],
        on_change=lambda e: navigate(e.control.selected_index),
    )
    page.add(ft.Row([rail, ft.VerticalDivider(width=1),
        ft.Column([ft.Row([ft.Text(APP_TITLE, weight=ft.FontWeight.BOLD, expand=True), status]),
                   content], expand=True)], expand=True))
    show_home()

if __name__ == "__main__":
    ft.app(target=main)
