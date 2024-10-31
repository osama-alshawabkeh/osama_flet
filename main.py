from flet import *


def main(page: Page):
    page.title = "osama"
   
    page.horizontal_alignment = CrossAxisAlignment.CENTER
    page.vertical_alignment= MainAxisAlignment.CENTER
    page.bgcolor=colors.AMBER
    
    
    t=Text("osama")

    
    page.add(t)
    page.update()
#,view=AppView.WEB_BROWSER
app(target=main)
